import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar-component";
import { Loader } from "@/components/Loader";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
  }
};

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const { data: workspaces = [] } = useGetWorkspacesQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      const urlWorkspaceId = searchParams.get("workspaceId");
      if (urlWorkspaceId) {
        const found = workspaces.find(w => w._id === urlWorkspaceId);
        if (found) setCurrentWorkspace(found);
      } else {
        setCurrentWorkspace(workspaces[0]);
      }
    }
  }, [workspaces, currentWorkspace, searchParams]);

  useEffect(() => {
    if (currentWorkspace && !searchParams.get("workspaceId")) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set("workspaceId", currentWorkspace._id);
        return newParams;
      }, { replace: true });
    }
  }, [currentWorkspace, searchParams, setSearchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarComponent currentWorkspace={currentWorkspace} />

      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />

        <main className="flex-1 overflow-y-auto h-full w-full bg-secondary/5">
          <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Outlet context={{ currentWorkspace }} />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
