import React, { useContext, useEffect, useState } from "react";
import { useParams, Route } from "react-router";

import { makeStyles } from "@material-ui/core";

import Bug from "../Bug";
import { UserContext } from "../../context/UserContext";
import { TimeContext, TimeProvider } from "../../context/TimeContext";
import { Redirect, useRouteMatch } from "react-router-dom";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../api";
import { BugProvider } from "../../context/BugContext";
import ProjectBoard from "./ProjectBoard/ProjectBoard";
import BugDetails from "../Bug/BugDetails";
import Time from "../Time/Time";
import ProjectSideBar from "./ProjectSideBar";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

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
  const { instance, accounts } = useMsal();
  const { url, path } = useRouteMatch();
  const { id } = useParams();
  const isAuthenticated = useIsAuthenticated;
  // const [currentProject, setCurrentProject] = useState({});

  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      if (isAuthenticated && userDetails.idTokenClaims) {
        const recentProject = {
          openedProjectId: id,
          openedByUserId: userDetails.idTokenClaims.oid,
        };
        const apiObj = await createAuthenticatedEndPoint(
          instance,
          accounts,
          RESTRICTEDENDPOINTS.RECENTPROJECTS
        );
        apiObj.create(recentProject);
      }
    })();
  }, [id, userDetails]);

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
          <TimeProvider>
            <Route path={`${url}/time`} component={() => <Time />}></Route>
          </TimeProvider>
          <BugDetails></BugDetails>
        </div>
      </BugProvider>
    </div>
  );
};

export default Project;
