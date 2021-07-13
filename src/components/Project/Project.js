import React, { useContext, useEffect } from "react";
import { useParams, Route } from "react-router";

import { makeStyles } from "@material-ui/core";

import ProjectSideBar from "../Main/ProjectSideBar";
import Bug from "../Bug";
import { UserContext } from "../../context/UserContext";
import { useRouteMatch } from "react-router-dom";

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

const Project = () => {
  const classes = useStyles();
  const { url, path } = useRouteMatch();
  const { id } = useParams();

  const { userName, setUserName, isLoggedIn, setIsLoggedIn, login } =
    useContext(UserContext);

  useEffect(() => {
    login();
  }, []);

  return (
    <div className={classes.root}>
      <ProjectSideBar className={classes.sidebar} />
      <div className={classes.content}>
        <Route path={`${url}/bugs`} component={Bug}></Route>
      </div>
    </div>
  );
};

export default Project;
