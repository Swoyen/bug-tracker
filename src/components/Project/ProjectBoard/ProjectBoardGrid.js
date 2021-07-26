import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@material-ui/core";
import { makeStyles, Typography } from "@material-ui/core";
import Draggable from "react-draggable";
import ProjectBoardCard from "./ProjectBoardCard";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    background: "#c1c1c1",
    borderTopLeftRadius: (props) => (props.start ? "10px" : "0px"),
    borderTopRightRadius: (props) => (props.end ? "10px" : "0px"),
    padding: theme.spacing(1),
    marginBottom: "3px",
  },
  boardGrid: {
    borderLeft: (props) => (props.start ? "1px solid gray" : ""),
    borderTopLeftRadius: (props) => (props.start ? "10px" : "0px"),
    borderBottomLeftRadius: (props) => (props.start ? "10px" : "0px"),
    borderTopRightRadius: (props) => (props.end ? "10px" : "0px"),
    borderBottomRightRadius: (props) => (props.end ? "10px" : "0px"),
    borderRight: "1px solid gray",
    maxWidth: "200px",
    background: "#eae9e9",
  },
}));

const ProjectBoardGrid = (props) => {
  const {
    status,
    title,
    bugListCorresponsingToStatus,
    modifyStatus,
    bugsWithStatus,
    setBugsWithStatus,
  } = props;
  const classes = useStyles(props);
  const [bugListWithStatus, setBugListWithStatus] = useState([]);
  // const [bugList, setBugList] = useState([]);

  useEffect(() => {
    return () => {
      setBugListWithStatus([]);
    };
  }, []);

  useEffect(() => {
    setBugListWithStatus(bugsWithStatus);

    return () => {
      setBugListWithStatus([]);
    };
  }, [bugsWithStatus]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      className={classes.boardGrid}
      item
      xs
    >
      <Typography
        align="left"
        className={classes.title}
        variant="subtitle1"
        color="initial"
      >
        {title}
      </Typography>
      {bugListWithStatus !== undefined
        ? bugListWithStatus.map((bugWithStatus, index) => {
            return bugWithStatus.status &&
              bugWithStatus.status.statusId === status.statusId ? (
              <ProjectBoardCard
                bug={bugWithStatus.bug}
                bugList={bugsWithStatus}
                setBugList={setBugsWithStatus}
                status={bugWithStatus.status}
                key={bugWithStatus.bug.bugId}
                modifyStatus={modifyStatus}
                bugId={bugWithStatus.bug.bugId}
                bugName={bugWithStatus.bug.bugName}
              ></ProjectBoardCard>
            ) : (
              <div key={bugWithStatus.bug.bugId}></div>
            );
          })
        : ""}
      {/* 
      <Grid item>
        <Draggable
          axis="both"
          onStart={(e) => dragStart(e)}
          onStop={(e) => dragEnd(e)}
          position={pos}
        >
          <Paper className={classes.bugPaper}>Test</Paper>
        </Draggable>
      </Grid> */}
      {/* 
      <Grid item>
        <Paper className={classes.bugPaper}>Test</Paper>
      </Grid> */}
    </Grid>
  );
};

export default ProjectBoardGrid;
