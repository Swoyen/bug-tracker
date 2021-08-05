import { makeStyles, Typography, Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import ProjectBoardGrid from "./ProjectBoardGrid";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import { useMsal } from "@azure/msal-react";
import { BugContext } from "../../../context/BugContext";

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
  const [bugListWithStatus, setBugListWithStatus] = useState([]);
  const { resetList } = useContext(BugContext);
  const { instance, accounts } = useMsal();

  const modifyStatus = (bugId, steps, setCurrentStatus) => {
    let bug = bugListWithStatus.find(
      (bugWithStatus) => bugWithStatus.bug.bugId === bugId
    );
    var currentIndex = statuses.findIndex(
      (status) => bug.status.statusId === status.statusId
    );
    var modifiedStatusIndex = currentIndex + steps;
    if (modifiedStatusIndex >= 0 && modifiedStatusIndex <= statuses.length) {
      var newStatus = statuses[modifiedStatusIndex];
      setCurrentStatus(newStatus);
      bug.status = newStatus;
    }
  };

  useEffect(() => {
    (async () => {
      if (statuses.length > 0) {
        const apiObj = await createAuthenticatedEndPoint(
          instance,
          accounts,
          RESTRICTEDENDPOINTS.BUG
        );
        let result = apiObj.fetchAll();
        result
          .then((res) => {
            let data = res.data;
            let bugsWithStatus = [];
            data.forEach((bug) => {
              bugsWithStatus.push({ status: bug.status, bug: bug });
            });

            setBugListWithStatus(bugsWithStatus);
          })
          .catch((err) => console.log(err));
      }
    })();

    return () => {
      setBugListWithStatus();
    };
  }, [statuses]);

  useEffect(() => {
    (async () => {
      const apiObj = await createAuthenticatedEndPoint(
        instance,
        accounts,
        RESTRICTEDENDPOINTS.STATUS
      );
      let result = apiObj.fetchAll();
      result
        .then((res) => {
          let data = res.data;
          setStatuses(data);
        })
        .catch((err) => console.log(err));
    })();

    return () => {
      setStatuses([]);
    };
  }, []);

  useEffect(() => {
    if (bugListWithStatus) resetList();
  }, [bugListWithStatus]);

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
                bugsWithStatus={bugListWithStatus}
                setBugsWithStatus={setBugListWithStatus}
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
