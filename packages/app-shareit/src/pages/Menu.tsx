import {FunctionComponent, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import NavigationLayout from "../components/NavigationLayout";
import CreateWorkspace from "../components/buttons/CreateWorkspace";
import InviteWorkspace from "../components/buttons/InviteWorkspace";
import {Api} from "../api";
import WorkspacesList from "../components/list/workspaces-list/WorkspacesList";
import {Workspace} from "../models";
import DisplayWorkspace from "../components/DisplayWorkspace";
import React from "react";

const Menu: FunctionComponent = () => {

  const isUserActive = localStorage.getItem('auth');
  const history = useHistory();
  if (!isUserActive) {
    history.replace('/');
  }
  const getWorkspaces = async () => {
    setWorkspaces([]);
    const tempWorkspaces = await Api.WorkspacesApi.list();
    if (tempWorkspaces.length > 0) {
      setWorkspaces(tempWorkspaces);
    }
  }

  useEffect(() => {
    getWorkspaces();
  }, []);

  const [activeWorkspace, setActiveWorkspace] = useState<Workspace|undefined>();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const handleAddWorkspace = (workspace: Workspace) => {
    setWorkspaces(workspaces.concat(workspace));
    setActiveWorkspace(workspace)
  }

  return (
    <NavigationLayout title="Menu">
      <div className="flex flex-row min-h-screen">
        <div className="border-2 border-gray-300 m-4 p-4 min-w-max w-1/5 flex flex-col items-center">
          <CreateWorkspace onSubmit={handleAddWorkspace}/>
          <div className="pt-6">
          {activeWorkspace && <InviteWorkspace workspace={activeWorkspace} /> }
          </div>
          <WorkspacesList
            activeWorkspace={activeWorkspace}
            onClick={(workspace) => setActiveWorkspace(workspace)}
            workspaces={workspaces}
          />
        </div>
        <div className=" border-2 border-gray-300 m-4 p-4 w-full">
          {activeWorkspace ? (
              <DisplayWorkspace workspace={activeWorkspace}/>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-xl font-semibold mb-4">Tu n'as pas de dossier partagé sélectionné</p>
              <img
                className="w-32"
                src="empty.png"
                alt="empty"
                />
            </div>
          )}
        </div>
      </div>
    </NavigationLayout>
  );
}

export default Menu;
