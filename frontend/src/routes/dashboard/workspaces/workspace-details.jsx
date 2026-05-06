import { Loader } from "@/components/Loader";
import { CreateProjectDialog } from "@/components/project/create-project";
import { InviteMemberDialog } from "@/components/workspace/invite-member";
import { ProjectList } from "@/components/workspace/project-list";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import { useState } from "react";
import { useParams } from "react-router-dom";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  if (!workspaceId) {
    return <div>No workspace found</div>;
  }

  const { data, isLoading } = useGetWorkspaceQuery(workspaceId) || {};

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!data) {
    return <div>Workspace data not available</div>;
  }

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data.workspace}
        members={data.workspace.members}
        activeTasks={data.totalTaskInProgress}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />

      <ProjectList
        workspaceId={workspaceId}
        projects={data.projects}
        onCreateProject={() => setIsCreateProject(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={data.workspace.members}
      />

      <InviteMemberDialog
        isOpen={isInviteMember}
        onOpenChange={setIsInviteMember}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default WorkspaceDetails;
