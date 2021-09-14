import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core";

import ProjectTable from "./ProjectTable";
import { useDispatch } from "react-redux";
import { loadProjects, setProjectSettingsShown } from "../../store/projects";
import ProjectSettings from "./ProjectSettings/ProjectSettings";

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
    return () => {
      dispatch(setProjectSettingsShown(false));
    };
  }, [dispatch]);
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <ProjectTable />
        <ProjectSettings />
      </div>
    </div>
  );
};

export default Projects;
