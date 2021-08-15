import React, { useEffect, useState, useContext } from "react";
import { Grid, Typography, Paper, Chip, Avatar } from "@material-ui/core";
import Draggable from "react-draggable";
import { makeStyles } from "@material-ui/core";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import { BugContext } from "../../../context/BugContext";
import { useMsal } from "@azure/msal-react";
const useStyles = makeStyles((theme) => ({
  root: {},
  bugPaper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    minHeight: "120px",
    zIndex: 1000,
    borderRadius: "5px",
  },
  draggingBugPaper: {
    zIndex: 999,
  },
  bugChip: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: theme.spacing(1),
  },
}));

const ProjectBoardCard = (props) => {
  const classes = useStyles();
  const { instance, accounts } = useMsal();
  const { bug, bugName, bugId, modifyStatus, status, bugList, setBugList } =
    props;

  const { setOpenBugDetails, setSelectedBugId, setSelectedBugComponent } =
    useContext(BugContext);

  const [startX, setStartX] = useState(0);
  // const [startY, setStartY] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [hidden, setHidden] = useState(false);

  // const [pos, setPos] = useState({ x: 0, y: 0 });
  const [currentStatus, setCurrentStatus] = useState(status);

  const dragStart = (e) => {
    setStartX(e.screenX);
    // setStartY(e.screenY);
    setIsDragging(true);
  };

  const dragEnd = (e, bugId) => {
    setIsDragging(false);
    let offsetX = startX - e.screenX;
    var steps;
    if (offsetX > 100) {
      steps = -Math.round(offsetX / 300);
      modifyStatus(bugId, steps, setCurrentStatus);
    } else if (offsetX < -100) {
      steps = -Math.round(offsetX / 300);
      modifyStatus(bugId, steps, setCurrentStatus);
    }
  };

  const showBugDetails = async (bugId) => {
    setSelectedBugId(bugId);
    setOpenBugDetails(true);

    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.BUG
    );
    let result = apiObj.fetchById(bugId);
    result
      .then((res) => setSelectedBugComponent(res.data))
      .catch((err) => console.log(err));
  };

  // TODO: Refactor this
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) {
        if (currentStatus.statusId !== status.statusId) {
          let tempBugList = bugList;
          let bugIndex = tempBugList.findIndex((bug) => bug.bug.id === bugId);
          console.log("Before", bugList);
          bug.status = currentStatus;

          let newBug = {
            bugId: bug.bugId,
            bugName: bug.bugName,
            createdDate: bug.createdDate,
            bugDescription: bug.bugDescription,
            reporterUserId: bug.reporter.userId,
            assigneeUserId: bug.assignee.userId,
            severityId: bug.severity.severityId,
            statusId: bug.status.statusId,
          };

          setHidden(true);
          const apiObj = await createAuthenticatedEndPoint(
            instance,
            accounts,
            RESTRICTEDENDPOINTS.BUG
          );
          let result = apiObj.update(bugId, newBug);
          result
            .then((res) => {
              tempBugList[bugIndex] = bug;
              console.log(tempBugList);
              setBugList([...tempBugList]);
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
              setHidden(false);
            });
        }
      }
    })();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStatus]);

  return (
    <Grid className={`${isDragging ? classes.draggingBugPaper : ""}`} item>
      {hidden ? (
        ""
      ) : (
        <Draggable
          axis="both"
          onStart={(e) => dragStart(e)}
          onStop={(e) => dragEnd(e, bugId, setCurrentStatus)}
          // position={pos}
        >
          <Paper className={`${classes.bugPaper}`} square={true} elevation={3}>
            <Typography variant="subtitle2" color="initial">
              {bugName}
            </Typography>
            <div className={classes.bugChip}>
              <Chip
                clickable
                onClick={() => showBugDetails(bugId)}
                size="small"
                avatar={<Avatar>F</Avatar>}
                label={bugId}
              />
            </div>
          </Paper>
        </Draggable>
      )}
    </Grid>
  );
};

export default ProjectBoardCard;
