import React, { useEffect, useState, useContext } from "react";
import ProjectCard from "./ProjectCard";
import { createProjectApiEndPoint } from "../../api";
import Grid from "@material-ui/core/Grid";
import { UserContext } from "../../context/BugContext";

const ProjectList = () => {
  const [projectList, setProjectList] = useState([]);
  const [projectName, setProjectName] = useContext(UserContext);
  useEffect(() => {
    (async () => {
      const response = await createProjectApiEndPoint().fetchAll();
      setProjectList(response.data);
    })();
  }, []);

  const test = () => {
    console.log("test");
  };
  return (
    <>
      <Grid container spacing={6}>
        {projectList.map((project) => (
          <Grid onClick={() => test()} item key={project.projectId}>
            <ProjectCard name={project.title}></ProjectCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProjectList;
