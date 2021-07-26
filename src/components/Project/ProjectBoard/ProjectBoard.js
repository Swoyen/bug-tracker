import { makeStyles, Paper, Typography, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ProjectBoardGrid from "./ProjectBoardGrid";
import Draggable from "react-draggable";
import { createAPIEndPoint, ENDPOINTS } from "../../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
  },
  boardGridContainer: {
    background: "green",
    width: "1000px",
    overflow: "auto",
    height: "1000px",
  },
  board: {
    background: "white",
    minHeight: "1200px",
  },
  boardGrid: {
    background: "blue",
  },
  boardSection: {
    padding: theme.spacing(1),
  },
}));

const ProjectBoard = () => {
  const classes = useStyles();
  const [statuses, setStatuses] = useState([]);
  const [bugList, setBugList] = useState([]);

  const modifyStatus = (bugId, steps, setCurrentStatus) => {
    let bug = bugList.find(
      (bugWithStatus) => bugWithStatus.bug.bugId === bugId
    );
    var currentIndex = statuses.findIndex(
      (status) => bug.status.statusId == status.statusId
    );
    var modifiedStatusIndex = currentIndex + steps;
    if (modifiedStatusIndex >= 0 && modifiedStatusIndex <= statuses.length) {
      var newStatus = statuses[modifiedStatusIndex];
      setCurrentStatus(newStatus);
      bug.status = newStatus;
    }
  };

  useEffect(() => {
    if (statuses.length > 0)
      createAPIEndPoint(ENDPOINTS.BUG)
        .fetchAll()
        .then((res) => {
          let data = res.data;
          let bugsWithStatus = [];
          data.forEach((bug) => {
            bugsWithStatus.push({ status: bug.status, bug: bug });
          });

          setBugList(bugsWithStatus);
        })
        .catch((err) => console.log(err));

    return () => {
      setBugList();
    };
  }, [statuses]);

  useEffect(() => {
    createAPIEndPoint(ENDPOINTS.STATUS)
      .fetchAll()
      .then((res) => {
        let data = res.data;
        setStatuses(data);
      })
      .catch((err) => console.log(err));

    return () => {
      setStatuses([]);
    };
  }, []);

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" color="initial">
        Project Board
      </Typography>
      <div className={classes.boardGridContainer}>
        <Grid className={classes.board} container>
          {statuses.map((status, index) => {
            return (
              <ProjectBoardGrid
                start={index === 0 ? true : false}
                end={index === statuses.length - 1 ? true : false}
                status={status}
                modifyStatus={modifyStatus}
                bugsWithStatus={bugList}
                setBugsWithStatus={setBugList}
                key={status.statusId}
                title={status.statusName}
              ></ProjectBoardGrid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
};

export default ProjectBoard;
