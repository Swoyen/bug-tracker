import React, { useContext, useEffect } from "react";
import { useParams, Route } from "react-router";

import { makeStyles } from "@material-ui/core";

import Bug from "../Bug";
import { UserContext } from "../../context/UserContext";
import { useRouteMatch } from "react-router-dom";
import ProjectBoard from "./ProjectBoard/ProjectBoard";

import Time from "../Time/Time";
import ProjectSideBar from "./ProjectSideBar";
import { useDispatch } from "react-redux";
import { addRecentProjects } from "../../store/projects";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignContent: "center",
  },
  sideBar: { flexShrink: 0 },
  content: {
    maxWidth: "1200px",
    padding: theme.spacing(3),
    textAlign: "center",
    flexGrow: 1,
  },
}));

const Project = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  useEffect(() => {
    dispatch(addRecentProjects(id, currentUser.userId));
  }, [id]);

  return (
    <div className={classes.root}>
      <ProjectSideBar className={classes.sidebar} />

      <div className={classes.content}>
        <Route path={`${url}/bugs`} component={() => <Bug />}></Route>
        <Route path={`${url}/board`} component={() => <ProjectBoard />}></Route>
        <Route path={`${url}/time`} component={() => <Time />}></Route>
      </div>
    </div>
  );
};

export default Project;
