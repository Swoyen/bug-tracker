import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import React, { useState, createContext, useEffect, useContext } from "react";

import {
  createAuthenticatedEndPoint,
  createRestrictedAPIEndPoint,
  RESTRICTEDENDPOINTS,
} from "../api";
import { UserContext } from "./UserContext";

export const ProjectContext = createContext();

export const ProjectProvider = (props) => {
  const [projectList, setProjectList] = useState([]);
  const { instance, accounts } = useMsal();
  const [projectIdToModify, setProjectIdToModify] = useState("-1");
  const [openProjectCreate, setOpenProjectCreate] = useState(false);
  const [openProjectSettings, setOpenProjectSettings] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    (async () => {
      if (isAuthenticated) await loadProjectList();
    })();
  }, [isAuthenticated]);

  const loadProjectList = async () => {
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.PROJECT
    );

    if (apiObj) {
      var result = apiObj.fetchAll();

      result.then((response) => setProjectList(response.data));
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projectList,
        loadProjectList,
        openProjectCreate,
        setOpenProjectCreate,
        openProjectSettings,
        setOpenProjectSettings,
        projectIdToModify,
        setProjectIdToModify,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
};
