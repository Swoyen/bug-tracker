import React, { useContext, useEffect, useState } from "react";
import { useParams, Route } from "react-router";

import { makeStyles } from "@material-ui/core";

import ProjectSideBar from "../Main/ProjectSideBar";
import Bug from "../Bug";
import { UserContext } from "../../context/UserContext";
import { Redirect, useRouteMatch } from "react-router-dom";
import { createRestrictedAPIEndPoint, RESTRICTEDENDPOINTS } from "../../api";
import { BugProvider } from "../../context/BugContext";
import ProjectBoard from "./ProjectBoard/ProjectBoard";
import BugDetails from "../Bug/BugDetails";
import Time from "../Time/Time";

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
  const { url, path } = useRouteMatch();
  const { id } = useParams();
  // const [currentProject, setCurrentProject] = useState({});

  const { userDetails, isLoggedIn, loginJwt } = useContext(UserContext);

  useEffect(() => {
    if (isLoggedIn) {
      const recentProject = {
        openedProjectId: id,
        openedByUserId: userDetails.userId,
      };
      createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.RECENTPROJECTS)
        .create(recentProject)
        .then()
        .catch((err) => console.log(err.data));
    }
  }, [id]);

  return (
    <div className={classes.root}>
      <ProjectSideBar className={classes.sidebar} />
      <BugProvider>
        <div className={classes.content}>
          <Route path={`${url}/bugs`} component={() => <Bug />}></Route>
          <Route
            path={`${url}/board`}
            component={() => <ProjectBoard />}
          ></Route>
          <Route path={`${url}/time`} component={() => <Time />}></Route>
          <BugDetails></BugDetails>
        </div>
      </BugProvider>
    </div>
  );
};

export default Project;
