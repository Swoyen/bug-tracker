import { makeStyles, Typography, Grid, Paper } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ProjectBoardGrid from "./ProjectBoardGrid";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import { useMsal } from "@azure/msal-react";
import { BugContext } from "../../../context/BugContext";
import BugDetails from "../../Bug/BugDetails";

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
  const classes = useStyles();
  const [statuses, setStatuses] = useState([]);
  const [bugListWithStatus, setBugListWithStatus] = useState([]);
  const [addCardShownList, setAddCardShownList] = useState([]);
  const { resetList } = useContext(BugContext);
  const { instance, accounts } = useMsal();

  const handleShowAddCard = (index) => {
    var temp = addCardShownList;
    for (var i = 0; i < temp.length; i++) {
      if (i === index) {
        temp[i] = true;
      } else {
        temp[i] = false;
      }
    }
    setAddCardShownList([...temp]);
  };

  const handleHideAddCard = () => {
    var temp = addCardShownList;
    for (var i = 0; i < temp.length; i++) {
      temp[i] = false;
    }
    setAddCardShownList([...temp]);
  };

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

  const fetchBugsWithStatus = async () => {
    await FetchBugsWithStatus();
    console.log("H");
  };

  const FetchBugsWithStatus = useCallback(async () => {
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
          bugsWithStatus.push({
            status: bug.status,
            bug: bug,
          });
        });

        setBugListWithStatus(bugsWithStatus);
      })
      .catch((err) => console.log(err));
  }, [instance, accounts]);

  const FetchStatus = useCallback(async () => {
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.STATUS
    );
    let result = apiObj.fetchAll();
    result
      .then((res) => {
        let data = res.data;
        var temp = [];
        data.forEach(() => temp.push(false));
        setAddCardShownList(temp);
        setStatuses(data);
      })
      .catch((err) => console.log(err));
  }, [instance, accounts]);

  useEffect(() => {
    (async () => {
      if (statuses.length > 0) {
        await FetchBugsWithStatus();
      }
    })();

    return () => {
      setBugListWithStatus([]);
    };
  }, [statuses, FetchBugsWithStatus]);

  useEffect(() => {
    (async () => {
      await FetchStatus();
    })();

    return () => {
      setStatuses([]);
    };
  }, [FetchStatus]);

  // TODO: fix resetList() usage warning
  useEffect(() => {
    if (bugListWithStatus) resetList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugListWithStatus]);

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
                // start={index === 0 ? true : false}
                // end={index === statuses.length - 1 ? true : false}
                addCardShown={addCardShownList[index]}
                showAddCard={() => handleShowAddCard(index)}
                hideAddCard={handleHideAddCard}
                status={status}
                modifyStatus={modifyStatus}
                bugsWithStatus={bugListWithStatus}
                setBugsWithStatus={setBugListWithStatus}
                key={status.statusId}
                title={status.statusName}
                index={index}
                resetList={fetchBugsWithStatus}
              ></ProjectBoardGrid>
            );
          })}
        </Grid>
      </div>
      <BugDetails
        handleDelete={fetchBugsWithStatus}
        s={() => console.log("hello")}
      ></BugDetails>
    </div>
  );
};

export default ProjectBoard;
