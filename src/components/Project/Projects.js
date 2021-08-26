import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core";

import ProjectTable from "./ProjectTable";
import { useDispatch } from "react-redux";
import { loadProjects } from "../../store/projects";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
  },
  sideBar: {},
  content: {
    maxWidth: "800px",
    margin: "auto",
    padding: theme.spacing(3),
    alignContent: "center",
    textAlign: "center",
    flexGrow: 1,
  },
}));

const Projects = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProjects());
  }, []);
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {/* <ProjectList></ProjectList>
        <ProjectCreate></ProjectCreate> */}
        <ProjectTable />
      </div>
    </div>
  );
};

export default Projects;
