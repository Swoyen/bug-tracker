import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "./ProjectCard";
import { createProjectAPIEndPoint } from "../../api";
import Grid from "@material-ui/core/Grid";
import { UserContext } from "../../context/UserContext";
import { ProjectContext } from "../../context/ProjectContext";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  link: {
    textDecoration: "none",
  },
}));

const ProjectList = () => {
  const [projectList, setProjectList] = useState([]);
  const {
    projectName,
    setProjectName,
    openProjectCreate,
    setOpenProjectCreate,
  } = useContext(ProjectContext);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      const response = await createProjectAPIEndPoint().fetchAll();
      setProjectList(response.data);
      console.log(response.data);
    })();
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        {projectList.map((project) => (
          <Grid
            // onClick={() => setProjectName(project.title)}
            item
            key={project.projectId}
          >
            <Link
              className={classes.link}
              to={`/projects/${project.projectId}`}
            >
              <ProjectCard name={project.title}></ProjectCard>
            </Link>
          </Grid>
        ))}
        <Grid onClick={() => setOpenProjectCreate(true)} item>
          <ProjectCard name={""}>
            <AddIcon />
          </ProjectCard>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectList;
