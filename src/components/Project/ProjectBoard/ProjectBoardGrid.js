import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles, Typography } from "@material-ui/core";

import ProjectBoardCard from "./ProjectBoardCard";
import ProjectBoardCardAdd from "./ProjectBoardCardAdd";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    background: "#c1c1c1",
    // borderTopLeftRadius: (props) => (props.start ? "10px" : "0px"),
    // borderTopRightRadius: (props) => (props.end ? "10px" : "0px"),
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    padding: theme.spacing(1),
    marginBottom: "3px",
  },
  boardGrid: {
    // borderLeft: (props) => (props.start ? "1px solid gray" : ""),
    // borderTopLeftRadius: (props) => (props.start ? "10px" : "0px"),
    // borderBottomLeftRadius: (props) => (props.start ? "10px" : "0px"),
    // borderTopRightRadius: (props) => (props.end ? "10px" : "0px"),
    // borderBottomRightRadius: (props) => (props.end ? "10px" : "0px"),
    borderRadius: "10px",
    maxWidth: "300px",
    margin: theme.spacing(0.5),
    background: "#eae9e9",
  },
}));

const ProjectBoardGrid = (props) => {
  const {
    status,
    title,
    modifyStatus,
    bugsWithStatus,
    setBugsWithStatus,
    addBugs,
    addCardShown,
    showAddCard,
    hideAddCard,
    resetList,
  } = props;
  const classes = useStyles(props);
  const [bugListWithStatus, setBugListWithStatus] = useState([]);

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

      <ProjectBoardCardAdd
        addCardShown={addCardShown}
        showAddCard={showAddCard}
        hideAddCard={hideAddCard}
        addBugs={addBugs}
        status={status}
        resetList={resetList}
      ></ProjectBoardCardAdd>
    </Grid>
  );
};

export default ProjectBoardGrid;
