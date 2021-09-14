import React, { useEffect } from "react";
import { useParams, Route } from "react-router";

import { makeStyles } from "@material-ui/core";

import Bug from "../Bug";
import { useRouteMatch } from "react-router-dom";
import ProjectBoard from "./ProjectBoard/ProjectBoard";

import Time from "../Time/Time";
import ProjectSideBar from "./ProjectSideBar";
import { useDispatch } from "react-redux";
import {
  addRecentProjects,
  loadProject,
  setCurrentProject,
} from "../../store/projects";
import BugsResolved from "../Bug/Resolved/BugsResolved";
import ProjectReport from "../Report/ProjectReport";
import ProjectSummary from "./ProjectSummary/ProjectSummary";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignContent: "center",
  },
  sideBar: { flexShrink: 0 },
  content: {
    padding: theme.spacing(3),
    flexGrow: 1,
    overflow: "auto",
  },
}));

const Project = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const { id } = useParams();
  const userId = useSelector((state) => state.entities.auth.userId);
  const loadedProject = useSelector(
    (state) => state.entities.projects.loadedProject
  );
  useEffect(() => {
    dispatch(loadProject(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (Object.keys(loadedProject).length > 0 && userId) {
      dispatch(addRecentProjects(id, userId));
      dispatch(setCurrentProject(id));
    }
  }, [loadedProject, id, userId, dispatch]);

  return (
    <div className={classes.root}>
      <ProjectSideBar className={classes.sidebar} />

      {/* <Container> */}
      <div className={classes.content}>
        <Route path={`${url}/bugs`} render={() => <Bug />}></Route>
        <Route path={`${url}/board`} render={() => <ProjectBoard />}></Route>
        <Route path={`${url}/time`} render={() => <Time />}></Route>
        <Route path={`${url}/report`} render={() => <ProjectReport />}></Route>
        <Route path={`${url}/resolved`} render={() => <BugsResolved />}></Route>
        <Route
          path={`${url}/summary`}
          render={() => <ProjectSummary />}
        ></Route>
      </div>
      {/* </Container> */}
    </div>
  );
};

export default Project;
