import BugList from "./BugList";

import React from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";

import { useDispatch } from "react-redux";
import { toggleBugCreateShown } from "../../store/bugs";

import BugDetails from "./Details/BugDetails";
import BugCreateButton from "./Create/BugCreateButton";
import BugCreate from "./Create/BugCreate";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "left" },
  buttons: { marginBottom: theme.spacing(2) },
}));

const Bug = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleToggleBugCreateShown = () => {
    dispatch(toggleBugCreateShown());
  };

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h5" color="initial">
        Bug Tracker
      </Typography>
      <Grid className={classes.buttons} container justifyContent="flex-end">
        <BugCreateButton
          onClick={() => handleToggleBugCreateShown()}
        ></BugCreateButton>
      </Grid>
      <BugList></BugList>
      <BugCreate></BugCreate>
      <BugDetails></BugDetails>
    </div>
  );
};

export default Bug;
