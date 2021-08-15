import React, { useContext, useEffect } from "react";
import { useParams, Route } from "react-router";

import { makeStyles } from "@material-ui/core";

import Bug from "../Bug";
import { UserContext } from "../../context/UserContext";
import { TimeProvider } from "../../context/TimeContext";
import { useRouteMatch } from "react-router-dom";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../api";
import { BugProvider } from "../../context/BugContext";
import ProjectBoard from "./ProjectBoard/ProjectBoard";
import BugDetails from "../Bug/BugDetails";
import Time from "../Time/Time";
import ProjectSideBar from "./ProjectSideBar";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import { useCallback } from "react";
import TimeConfirmDialog from "../Time/TimeConfirmDialog";

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
  const { url } = useRouteMatch();
  const { id } = useParams();
  const isAuthenticated = useIsAuthenticated;
  // const [currentProject, setCurrentProject] = useState({});

  const { currentUser } = useContext(UserContext);

  const FetchRecentProjects = useCallback(async () => {
    const recentProject = {
      openedProjectId: id,
      openedByUserId: currentUser.userId,
    };
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.RECENTPROJECTS
    );
    apiObj.create(recentProject);
  }, [instance, accounts, id, currentUser.userId]);

  useEffect(() => {
    (async () => {
      if (isAuthenticated && currentUser.userId) {
        FetchRecentProjects();
      }
    })();
  }, [id, currentUser, isAuthenticated, FetchRecentProjects]);

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

          <Route
            path={`${url}/time`}
            component={() => (
              <TimeProvider>
                <Time />{" "}
              </TimeProvider>
            )}
          ></Route>
        </div>
      </BugProvider>
    </div>
  );
};

export default Project;
