import { makeStyles, Typography, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ProjectBoardGrid from "./ProjectBoardGrid";

import BugDetails from "../../Bug/Details/BugDetails";
import { useDispatch, useSelector } from "react-redux";
import { getAllBugs, loadBugs } from "../../../store/bugs";
import { getAllStatuses, loadStatuses } from "../../../store/status";
import {
  getBugsWithStatus,
  initializeAddCardList,
  initializeBugsWithStatus,
} from "../../../store/board";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    textAlign: "left",
  },
  boardGridContainer: {
    background: "green",
    width: "1200px",
    overflow: "auto",
    maxHeight: "1000px",
  },
  board: {
    background: "white",
    maxHeight: "1200px",
  },
  boardGrid: {
    background: "blue",
  },
  boardSection: {
    padding: theme.spacing(1),
  },
}));

const ProjectBoard = () => {
  const dispatch = useDispatch();
  const bugs = useSelector(getAllBugs);
  const statuses = useSelector(getAllStatuses);

  useEffect(() => {
    dispatch(loadStatuses());
    dispatch(loadBugs());
  }, []);

  useEffect(() => {
    if (bugs.length > 0 && statuses.length > 0) {
      dispatch(initializeBugsWithStatus(bugs, statuses));
    }
  }, [bugs.length, statuses.length]);

  useEffect(() => {
    if (statuses.length > 0) {
      dispatch(initializeAddCardList(statuses.length));
    }
  }, [statuses]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h5" color="initial">
        Project Board
      </Typography>
      <div className={classes.boardGridContainer}>
        <Grid className={classes.board} container>
          {statuses.map((status, index) => {
            return (
              <ProjectBoardGrid
                status={status}
                key={status.statusId}
                title={status.statusName}
                index={index}
              ></ProjectBoardGrid>
            );
          })}
        </Grid>
      </div>
      <BugDetails
        handleDelete={() => console.log("Hello")}
        s={() => console.log("hello")}
      ></BugDetails>
    </div>
  );
};

export default ProjectBoard;
