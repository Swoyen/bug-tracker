import React, { useState, createContext } from "react";

export const ProjectContext = createContext();

export const ProjectProvider = (props) => {
  const [projectName, setProjectName] = useState("");
  return (
    <ProjectContext.Provider value={[projectName, setProjectName]}>
      {props.children}
    </ProjectContext.Provider>
  );
};

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userName, setUserName] = useState("");
  return (
    <UserContext.Provider value={[userName, setUserName]}>
      {props.children}
    </UserContext.Provider>
  );
};

export const TestContext = createContext();

export const TestProvider = (props) => {
  const [a, setA] = useState("");
  return (
    <TestContext.Provider value={[a, setA]}>
      {props.children}
    </TestContext.Provider>
  );
};
