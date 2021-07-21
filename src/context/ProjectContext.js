import React, { useState, createContext, useEffect, useContext } from "react";

import { createRestrictedAPIEndPoint, RESTRICTEDENDPOINTS } from "../api";
import { UserContext } from "./UserContext";

export const ProjectContext = createContext();

export const ProjectProvider = (props) => {
  const [projectList, setProjectList] = useState([]);
  const [projectIdToModify, setProjectIdToModify] = useState("-1");
  const [openProjectCreate, setOpenProjectCreate] = useState(false);
  const [openProjectSettings, setOpenProjectSettings] = useState(false);

  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    if (isLoggedIn) loadProjectList();
  }, [isLoggedIn]);

  const loadProjectList = async () => {
    const response = await createRestrictedAPIEndPoint(
      RESTRICTEDENDPOINTS.PROJECT
    ).fetchAll();
    setProjectList(response.data);
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
