import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import { Card, Typography, CardContent, makeStyles } from "@material-ui/core";

import { UserContext } from "../../context/UserContext";
import ProjectTable from "./ProjectTable";

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

const Projects = (props) => {
  const { userName, setUserName, isLoggedIn, setIsLoggedIn, loginJwt } =
    useContext(UserContext);

  const classes = useStyles();
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
