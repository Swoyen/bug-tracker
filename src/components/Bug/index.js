import BugList from "./BugList";

import React from "react";
import { Grid, Typography } from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { loadUnresolvedBugs, toggleBugCreateShown } from "../../store/bugs";

import BugDetails from "./Details/BugDetails";
import BugCreateButton from "./Create/BugCreateButton";
import BugCreate from "./Create/BugCreate";
import { useEffect } from "react";
import { loadLabels } from "../../store/labels";
import BugListSearch from "./BugListSearch";

const Bug = () => {
  const dispatch = useDispatch();
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );

  useEffect(() => {
    if (projectId !== -1) {
      dispatch(loadUnresolvedBugs(projectId));
      dispatch(loadLabels());
    }
  }, [projectId, dispatch]);

  const handleToggleBugCreateShown = () => {
    dispatch(toggleBugCreateShown());
  };

  return (
    <>
      <Grid container item xs={12} justifyContent="space-between">
        <Grid item>
          <Typography gutterBottom variant="h5" color="initial">
            Issue Tracker
          </Typography>
        </Grid>
        <Grid item>
          <BugCreateButton
            onClick={() => handleToggleBugCreateShown()}
          ></BugCreateButton>
        </Grid>
      </Grid>
      <BugListSearch />
      <BugList></BugList>
      <BugCreate></BugCreate>
      <BugDetails></BugDetails>
    </>
  );
};

export default Bug;
