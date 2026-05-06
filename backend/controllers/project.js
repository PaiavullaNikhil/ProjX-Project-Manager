import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";
import ActivityLog from "../models/activity.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members, initialTasks } =
      req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const tagArray = tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [];

    // Ensure the creator is in the members list
    const memberList = Array.isArray(members) ? [...members] : [];
    const isCreatorInMembers = memberList.some(m => 
      (typeof m === 'string' ? m : m.user?.toString()) === req.user._id.toString()
    );

    if (!isCreatorInMembers) {
      memberList.push({ user: req.user._id, role: "manager" });
    }

    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members: memberList,
      createdBy: req.user._id,
    });

    if (initialTasks && Array.isArray(initialTasks) && initialTasks.length > 0) {
      const tasksToCreate = initialTasks.map(t => ({
        ...t,
        project: newProject._id,
        createdBy: req.user._id,
        assignees: [req.user._id]
      }));
      
      try {
        const createdTasks = await Task.insertMany(tasksToCreate);
        newProject.tasks = createdTasks.map(t => t._id);
        await newProject.save();
      } catch (taskError) {
        console.error("Error creating initial tasks:", taskError);
        // We continue anyway, as the project was created successfully
      }
    }

    workspace.projects.push(newProject._id);
    await workspace.save();

    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("members.user", "name email profilePicture")
      .populate("createdBy", "name email profilePicture");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => (member.user?._id || member.user).toString() === req.user._id.toString()
    );

    const isCreator = project.createdBy?._id?.toString() === req.user._id.toString();

    if (!isMember && !isCreator) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    // If the creator is not in members, add them virtually for the frontend
    const projectObj = project.toObject();
    const isCreatorInMembers = projectObj.members.some(
      (m) => (m.user?._id || m.user).toString() === project.createdBy?._id.toString()
    );

    if (!isCreatorInMembers && project.createdBy) {
      projectObj.members.push({
        user: project.createdBy,
        role: "manager"
      });
    }

    res.status(200).json(projectObj);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId)
      .populate("members.user", "name email profilePicture")
      .populate("createdBy", "name email profilePicture");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => (member.user?._id || member.user).toString() === req.user._id.toString()
    );

    const isCreator = project.createdBy?._id?.toString() === req.user._id.toString();

    if (!isMember && !isCreator) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const tasks = await Task.find({
      project: projectId,
      isArchived: false,
    })
      .populate("assignees", "name profilePicture")
      .sort({ createdAt: -1 });

    // If the creator is not in members, add them virtually for the frontend
    const projectObj = project.toObject();
    const isCreatorInMembers = projectObj.members.some(
      (m) => (m.user?._id || m.user).toString() === project.createdBy?._id.toString()
    );

    if (!isCreatorInMembers && project.createdBy) {
      projectObj.members.push({
        user: project.createdBy,
        role: "manager"
      });
    }

    res.status(200).json({
      project: projectObj,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;

    const activities = await ActivityLog.find({ 
      resourceId: projectId,
      resourceType: "Project" 
    })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    // Also get activities for all tasks in this project
    const tasks = await Task.find({ project: projectId });
    const taskIds = tasks.map(t => t._id);

    const taskActivities = await ActivityLog.find({
      resourceId: { $in: taskIds },
      resourceType: "Task"
    })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    const allActivities = [...activities, ...taskActivities].sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(allActivities.slice(0, 50)); // Return last 50 activities
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, startDate, dueDate, tags } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is manager or creator
    const isManager = project.members.some(
      (m) => m.user.toString() === req.user._id.toString() && m.role === "manager"
    );
    const isCreator = project.createdBy.toString() === req.user._id.toString();

    if (!isManager && !isCreator) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    project.status = status || project.status;
    project.startDate = startDate || project.startDate;
    project.dueDate = dueDate || project.dueDate;
    if (tags) {
      project.tags = Array.isArray(tags) ? tags : tags.split(",");
    }

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    if (!isCreator) {
      return res.status(403).json({ message: "Only the project creator can delete it" });
    }

    const workspaceId = project.workspace;

    // Delete tasks, activities, and the project itself
    await Promise.all([
      Task.deleteMany({ project: projectId }),
      ActivityLog.deleteMany({ resourceId: projectId, resourceType: "Project" }),
      Project.deleteOne({ _id: projectId }),
      Workspace.updateOne(
        { _id: workspaceId },
        { $pull: { projects: projectId } }
      )
    ]);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { 
  createProject, 
  getProjectDetails, 
  getProjectTasks, 
  getProjectActivities,
  updateProject,
  deleteProject
};

