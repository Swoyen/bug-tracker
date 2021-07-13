import React, { useState, createContext, useEffect } from "react";

import { createProjectAPIEndPoint } from "../api";

export const ProjectContext = createContext();

export const ProjectProvider = (props) => {
  const [projectList, setProjectList] = useState([]);
  const [openProjectCreate, setOpenProjectCreate] = useState(false);

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
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
};
