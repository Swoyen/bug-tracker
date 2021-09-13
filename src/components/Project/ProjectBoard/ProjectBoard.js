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
import ProjectBoardSearch from "./ProjectBoardSearch";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
    boxSizing: "border-box",
  },
  boardGridContainer: {
    background: "green",
    overflow: "auto",
    maxHeight: "1000px",
    maxWidth: "1200px",
  },
  board: {
    background: "white",
    minWidth: "1200px",
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
  const labels = useSelector((state) => state.entities.labels.list);
  const statuses = useSelector(getAllStatuses);

  useEffect(() => {
    if (projectId !== -1 && labels.length > 0) {
      dispatch(loadUnresolvedBugs(projectId));
    }
  }, [projectId, labels.length]);

  useEffect(() => {
    dispatch(loadStatuses());
    dispatch(loadLabels());
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
          <ProjectBoardSearch />
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
        </>
      )}
      <BugDetails removeFromBoard={true}></BugDetails>
    </div>
  );
};

export default ProjectBoard;
