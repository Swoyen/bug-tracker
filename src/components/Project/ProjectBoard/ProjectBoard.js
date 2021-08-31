import { makeStyles, Typography, Grid, Container } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ProjectBoardGrid from "./ProjectBoardGrid";

import BugDetails from "../../Bug/Details/BugDetails";
import { useDispatch, useSelector } from "react-redux";
import { getAllBugs, loadBugs, loadUnresolvedBugs } from "../../../store/bugs";
import { getAllStatuses, loadStatuses } from "../../../store/status";
import {
  initializeAddCardList,
  initializeBugsWithStatus,
} from "../../../store/board";
import ContentLoader from "react-content-loader";
import { loadLabels } from "../../../store/labels";

const useStyles = makeStyles((theme) => ({
  root: {
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
  const { list: bugs, loading } = useSelector((state) => state.entities.bugs);
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );
  const statuses = useSelector(getAllStatuses);

  useEffect(() => {
    if (projectId !== -1) {
      dispatch(loadUnresolvedBugs(projectId));
      dispatch(loadLabels());
    }
  }, [projectId]);

  useEffect(() => {
    dispatch(loadStatuses());
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
      {loading ? (
        <ContentLoader />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ProjectBoard;
