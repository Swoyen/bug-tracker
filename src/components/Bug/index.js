import BugList from "./BugList";

import React from "react";
import { Grid, makeStyles, Typography, Container } from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import {
  loadBugs,
  loadUnresolvedBugs,
  toggleBugCreateShown,
} from "../../store/bugs";

import BugDetails from "./Details/BugDetails";
import BugCreateButton from "./Create/BugCreateButton";
import BugCreate from "./Create/BugCreate";
import { useEffect } from "react";
import { loadLabels } from "../../store/labels";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "left" },
  buttons: { marginBottom: theme.spacing(2) },
}));

const Bug = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );

  useEffect(() => {
    if (projectId !== -1) {
      dispatch(loadUnresolvedBugs(projectId));
      dispatch(loadLabels());
    }
  }, [projectId]);

  const handleToggleBugCreateShown = () => {
    dispatch(toggleBugCreateShown());
  };

  return (
    <div className={classes.root}>
      <Grid container justifyContent="space-between">
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

      <BugList></BugList>
      <BugCreate></BugCreate>
      <BugDetails></BugDetails>
    </div>
  );
};

export default Bug;
