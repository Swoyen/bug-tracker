import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadResolvedBugs, UnloadBugs } from "../../../store/bugs";
import BugList from "../BugList";
import BugDetails from "../Details/BugDetails";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import { loadLabels } from "../../../store/labels";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
  },
}));

const BugsResolved = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );

  useEffect(() => {
    if (projectId !== -1) {
      dispatch(loadResolvedBugs(projectId));
      dispatch(loadLabels());
    }
    return () => {
      dispatch(UnloadBugs());
    };
  }, [projectId, dispatch]);

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h5" color="initial">
        Resolved Issues
      </Typography>
      <BugList resolved={true} />

      <BugDetails />
    </div>
  );
};

export default BugsResolved;
