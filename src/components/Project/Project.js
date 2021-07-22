import React, { useContext, useEffect, useState } from "react";
import { useParams, Route } from "react-router";

import { makeStyles } from "@material-ui/core";

import ProjectSideBar from "../Main/ProjectSideBar";
import Bug from "../Bug";
import { UserContext } from "../../context/UserContext";
import { useRouteMatch } from "react-router-dom";
import { createRestrictedAPIEndPoint, RESTRICTEDENDPOINTS } from "../../api";
import { BugProvider } from "../../context/BugContext";

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
  // const [currentProject, setCurrentProject] = useState({});

  const { userDetails, isLoggedIn, loginJwt } = useContext(UserContext);

  useEffect(() => {
    if (!isLoggedIn) loginJwt();
    // createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.PROJECT)
    //   .fetchById(id)
    //   .then((res) => {
    //     setCurrentProject(res.data);
    //   })
    //   .catch((err) => console.log(err));

    const recentProject = {
      openedProjectId: id,
      openedByUserId: userDetails.userId,
    };
    createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.RECENTPROJECTS)
      .create(recentProject)
      .then()
      .catch((err) => console.log(err.data));
  }, [id]);

  return (
    <div className={classes.root}>
      <ProjectSideBar className={classes.sidebar} />
      <div className={classes.content}>
        <Route
          path={`${url}/bugs`}
          component={() => (
            <BugProvider>
              <Bug />
            </BugProvider>
          )}
        ></Route>
      </div>
    </div>
  );
};

export default Project;
