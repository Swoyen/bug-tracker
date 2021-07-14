import React, { useState, createContext, useEffect } from "react";

import { createProjectAPIEndPoint } from "../api";

export const ProjectContext = createContext();

export const ProjectProvider = (props) => {
  const [projectList, setProjectList] = useState([]);
  const [projectIdToModify, setProjectIdToModify] = useState("-1");
  const [openProjectCreate, setOpenProjectCreate] = useState(false);
  const [openProjectSettings, setOpenProjectSettings] = useState(false);

  useEffect(() => {
    loadProjectList();
  }, []);

  const loadProjectList = async () => {
    const response = await createProjectAPIEndPoint().fetchAll();
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
