import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Card, Typography, CardContent, makeStyles } from "@material-ui/core";
import ProjectList from "./ProjectList";
import ProjectCreate from "./ProjectCreate";
import ProjectSideBar from "../Main/ProjectSideBar";

import Bug from "../Bug";
import { UserContext } from "../../context/UserContext";
import { createProjectAPIEndPoint } from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  sideBar: {},
  content: {
    padding: theme.spacing(3),
    alignContent: "center",
    textAlign: "center",
    flexGrow: 1,
  },
}));

const Projects = (props) => {
  const { userName, setUserName, isLoggedIn, setIsLoggedIn, login } =
    useContext(UserContext);

  useEffect(() => {
    login();
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ProjectSideBar className={classes.sidebar} />
      <div className={classes.content}>
        <ProjectList></ProjectList>
        <ProjectCreate></ProjectCreate>
      </div>
    </div>
  );
};

export default Projects;
