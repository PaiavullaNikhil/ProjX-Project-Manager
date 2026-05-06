import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { recordActivity } from "../libs/index.js";
import { sendEmail } from "../libs/send-email.js";
import Project from "../models/project.js";
import User from "../models/user.js";
import WorkspaceInvite from "../models/workspace-invite.js";
import Workspace from "../models/workspace.js";
import ActivityLog from "../models/activity.js";

const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateWorkspaceOwner = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { newOwnerId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(newOwnerId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      owner: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You're not authorized to make changes to this workspace",
      });
    }

    if (userId.toString() === newOwnerId.toString()) {
      return res.status(400).json({
        message: "You cannot transfer ownership to yourself",
      });
    }

    const existingUser = await User.findById(newOwnerId);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    workspace.owner = newOwnerId;

    workspace.members = workspace.members.map((member) => {
      if (member.user.toString() === userId.toString()) {
        return { ...member.toObject(), role: "admin" };
      }
      if (member.user.toString() === newOwnerId.toString()) {
        return { ...member.toObject(), role: "owner" };
      }
      return member;
    });

    await workspace.save();

    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description, color } = req.body;

    // const workspace = await Workspace.findById(workspaceId);
    const userId = req.user._id;
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      owner: userId,
    });

    if (!workspace) {
      return res.status(404).json({
        message: "You're not authorized to make changes to this workspace",
      });
    }

    workspace.name = name;
    workspace.description = description;
    workspace.color = color;

    await workspace.save();

    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const userId = req.user._id;
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      owner: userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "You're not authorized to delete this workspace" });
    }

    await Workspace.deleteOne({ _id: workspaceId });

    return res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting workspace:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById({
      _id: workspaceId,
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    res.status(200).json(workspace);
  } catch (error) {}
};

const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "_id name email profilePicture"
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const members = workspace.members.map((member) => ({
      _id: member.user._id,
      name: member.user.name,
      email: member.user.email,
      profilePicture: member.user.profilePicture,
      role: member.role,
      joinedAt: member.joinedAt,
    }));

    res.status(200).json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      $or: [
        { members: { $elemMatch: { user: req.user._id } } },
        { createdBy: req.user._id }
      ]
    })
      .populate("tasks", "status")
      .sort({ createdAt: -1 });

    const totalTaskInProgress = projects.reduce((acc, project) => {
      return acc + project.tasks.filter(t => t.status === "In Progress").length;
    }, 0);

    res.status(200).json({ projects, workspace, totalTaskInProgress });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this workspace" });
    }

    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Project.find({ workspace: workspaceId })
        .populate(
          "tasks",
          "title status dueDate project updatedAt isArchived priority"
        )
        .sort({ createdAt: -1 }),
    ]);

    const tasks = projects.flatMap((project) => project.tasks);

    const totalTasks = tasks.length;
    const totalProjectInProgress = projects.filter(p => p.status === "In Progress").length;
    const totalProjectCompleted = projects.filter(p => p.status === "Completed").length;

    const totalTaskCompleted = tasks.filter(task => task.status === "Done").length;
    const totalTaskToDo = tasks.filter(task => task.status === "To Do").length;
    const totalTaskInProgress = tasks.filter(task => task.status === "In Progress").length;

    const today = new Date();
    const last7DaysDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prev7DaysDate = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Calculate Velocity
    const completedThisWeek = tasks.filter(t => t.status === "Done" && new Date(t.updatedAt) >= last7DaysDate).length;
    const completedLastWeek = tasks.filter(t => t.status === "Done" && new Date(t.updatedAt) >= prev7DaysDate && new Date(t.updatedAt) < last7DaysDate).length;
    const velocity = completedLastWeek === 0 ? completedThisWeek * 100 : Math.round(((completedThisWeek - completedLastWeek) / completedLastWeek) * 100);

    // Bottleneck detection
    const bottleneck = totalTaskInProgress > totalTaskToDo && totalTaskInProgress > 5 ? "In Progress" : null;

    // Critical Tasks for Forecast
    const criticalTasks = tasks
      .filter(t => t.status !== "Done" && t.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3)
      .map(t => ({
        id: t._id,
        title: t.title,
        project: projects.find(p => p._id.toString() === t.project.toString())?.title || "Unknown",
        due: new Date(t.dueDate) < today ? "Overdue" : 
             new Date(t.dueDate) <= new Date(today.getTime() + 24 * 60 * 60 * 1000) ? "24h left" : 
             "Soon",
        severity: t.priority === "High" ? "critical" : 
                  new Date(t.dueDate) <= new Date(today.getTime() + 24 * 60 * 60 * 1000) ? "warning" : "low"
      }));

    const upcomingTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate > today &&
        taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

    const taskTrendsData = [
      { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
    ];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // Get past 7 days in order
      return date;
    });

    for (const task of tasks) {
      const taskDate = new Date(task.updatedAt);

      const matchedDateIndex = last7Days.findIndex(
        (date) =>
          date.getDate() === taskDate.getDate() &&
          date.getMonth() === taskDate.getMonth() &&
          date.getFullYear() === taskDate.getFullYear()
      );

      if (matchedDateIndex !== -1) {
        const dayName = last7Days[matchedDateIndex].toLocaleDateString("en-US", {
          weekday: "short",
        });

        const trendEntry = taskTrendsData.find((entry) => entry.name === dayName);

        if (trendEntry) {
          if (task.status === "Done") trendEntry.completed++;
          else if (task.status === "In Progress") trendEntry.inProgress++;
          else if (task.status === "To Do") trendEntry.toDo++;
        }
      }
    }

    const projectStatusData = [
      { name: "Completed", value: 0, color: "#10b981" },
      { name: "In Progress", value: 0, color: "#3b82f6" },
      { name: "Planning", value: 0, color: "#f59e0b" },
    ];

    for (const project of projects) {
      if (project.status === "Completed") projectStatusData[0].value++;
      else if (project.status === "In Progress") projectStatusData[1].value++;
      else if (project.status === "Planning") projectStatusData[2].value++;
    }

    const taskPriorityData = [
      { name: "High", value: 0, color: "#ef4444" },
      { name: "Medium", value: 0, color: "#f59e0b" },
      { name: "Low", value: 0, color: "#6b7280" },
    ];

    for (const task of tasks) {
      if (task.priority === "High") taskPriorityData[0].value++;
      else if (task.priority === "Medium") taskPriorityData[1].value++;
      else if (task.priority === "Low") taskPriorityData[2].value++;
    }

    const workspaceProductivityData = [];

    for (const project of projects) {
      const projectTasks = tasks.filter(
        (task) => task.project.toString() === project._id.toString()
      );
      const completedTasks = projectTasks.filter(
        (task) => task.status === "Done" && task.isArchived === false
      );

      workspaceProductivityData.push({
        name: project.title,
        completed: completedTasks.length,
        total: projectTasks.length,
      });
    }

    const stats = {
      totalProjects,
      totalTasks,
      totalProjectInProgress,
      totalProjectCompleted,
      totalTaskCompleted,
      totalTaskToDo,
      totalTaskInProgress,
    };

    return res.status(200).json({
      stats,
      intelligence: {
        velocity,
        bottleneck,
        criticalTasks
      },
      taskTrendsData,
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      upcomingTasks,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const inviteUserToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const userMemberInfo = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!userMemberInfo || !["admin", "owner"].includes(userMemberInfo.role)) {
      return res.status(403).json({
        message: "You are not authorized to invite members to this workspace",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === existingUser._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "User already a member of this workspace",
      });
    }

    const isInvited = await WorkspaceInvite.findOne({
      user: existingUser._id,
      workspaceId: workspaceId,
    });

    if (isInvited && isInvited.expiresAt > new Date()) {
      return res.status(400).json({
        message: "User already invited to this workspace",
      });
    }

    if (isInvited && isInvited.expiresAt < new Date()) {
      await WorkspaceInvite.deleteOne({ _id: isInvited._id });
    }

    const inviteToken = jwt.sign(
      {
        user: existingUser._id,
        workspaceId: workspaceId,
        role: role || "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await WorkspaceInvite.create({
      user: existingUser._id,
      workspaceId: workspaceId,
      token: inviteToken,
      role: role || "member",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?tk=${inviteToken}`;

    const emailContent = `
      <p>You have been invited to join ${workspace.name} workspace</p>
      <p>Click here to join: <a href="${invitationLink}">${invitationLink}</a></p>
    `;

    await sendEmail(
      email,
      "You have been invited to join a workspace",
      emailContent
    );

    res.status(200).json({
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const acceptGenerateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "You are already a member of this workspace",
      });
    }

    workspace.members.push({
      user: req.user._id,
      role: "member",
      joinedAt: new Date(),
    });

    await workspace.save();

    await recordActivity(
      req.user._id,
      "joined_workspace",
      "Workspace",
      workspaceId,
      {
        description: `Joined ${workspace.name} workspace`,
      }
    );

    res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const acceptInviteByToken = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { user, workspaceId, role } = decoded;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === user.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "User already a member of this workspace",
      });
    }

    const inviteInfo = await WorkspaceInvite.findOne({
      user: user,
      workspaceId: workspaceId,
    });

    if (!inviteInfo) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    if (inviteInfo.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Invitation has expired",
      });
    }

    workspace.members.push({
      user: user,
      role: role || "member",
      joinedAt: new Date(),
    });

    await workspace.save();

    await Promise.all([
      WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
      recordActivity(user, "joined_workspace", "Workspace", workspaceId, {
        description: `Joined ${workspace.name} workspace`,
      }),
    ]);

    res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getWorkspaceActivity = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    
    // In a real app, we might need to filter by projects within the workspace
    // For now, we'll fetch activities where resourceType is Workspace or where resource is related to workspace projects
    const projects = await Project.find({ workspace: workspaceId }).select("_id");
    const projectIds = projects.map(p => p._id);

    const activities = await ActivityLog.find({
      $or: [
        { resourceType: "Workspace", resourceId: workspaceId },
        { resourceType: "Project", resourceId: { $in: projectIds } },
        { resourceType: "Task", "details.projectId": { $in: projectIds } } // Assuming we store projectId in details
      ]
    })
    .populate("user", "name profilePicture")
    .sort({ createdAt: -1 })
    .limit(50);

    res.status(200).json(activities);
  } catch (error) {
    console.error("Activity log error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  acceptGenerateInvite,
  acceptInviteByToken,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceActivity,
  getWorkspaceDetails,
  getWorkspaceMembers,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
  updateWorkspace,
  updateWorkspaceOwner
};

