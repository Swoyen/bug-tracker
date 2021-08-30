import React, { useEffect, useState } from "react";
import { Grid, Typography, Paper, Chip, Avatar } from "@material-ui/core";
import { DraggableCore } from "react-draggable";
import { makeStyles, IconButton } from "@material-ui/core";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMoveCardShownBugList,
  hideMoveCardSilhouette,
  showMoveCardSilhouette,
} from "../../../store/board";
import { showBug } from "../../../store/bug";
import ProjectBoardCardTags from "./ProjectBoardCardTags";

const useStyles = makeStyles((theme) => ({
  bugPaper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    minHeight: "120px",
    //borderRadius: "5px",
    position: "relative",
  },
  draggingBugPaper: {
    width: "232px",
    position: "absolute",
    zIndex: 999,
  },
  bugChipParent: {
    position: "absolute",
    right: 0,
    bottom: 0,
    background: "yellow",
  },
}));

const bugTags = [
  {
    id: 1,
    name: "Heol",
    color: "#B8255F",
  },
  {
    id: 2,
    name: "Heol",
    color: "#B8255F",
  },
  {
    id: 3,
    name: "Heol",
    color: "#B8255F",
  },
  {
    id: 4,
    name: "Heol",
    color: "#B8255F",
  },
];

const ProjectBoardCard = (props) => {
  const classes = useStyles();
  const { index, bugName, bugId, statusId, modifyBug } = props;

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const [pos3, setPos3] = useState(0);
  const [pos4, setPos4] = useState(0);

  const [currentMoveSilhouetteSteps, setCurrentMoveSilhouetteSteps] =
    useState(0);

  const [currentMoveSilhouetteYIndex, setCurrentMoveSilhouetteYIndex] =
    useState(index);

  // const [pos1, setPos1] = useState(0);
  // const [pos2, setPos2] = useState(0);

  const divRef = useRef(null);
  const dispatch = useDispatch();

  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      setStartX(0);
      setStartY(0);
      setIsDragging(false);
      setPos({ x: 0, y: 0 });
    };
  }, []);

  const dragStart = (e) => {
    if (isDragging) return;
    setPos3(e.clientX);
    setPos4(e.clientY);
    setStartX(e.clientX);
    setStartY(e.clientY);

    divRef.current.style.top = divRef.current.offsetTop - 8 + "px";
    divRef.current.style.left = divRef.current.offsetLeft + "px";

    dispatch(showMoveCardSilhouette(statusId, 0, index));
    setCurrentMoveSilhouetteYIndex(index);
    setCurrentMoveSilhouetteSteps(0);
    setIsDragging(true);
  };

  const dragging = (e) => {
    var pos1 = pos3 - e.clientX;
    var pos2 = pos4 - e.clientY;

    setPos3(e.clientX);
    setPos4(e.clientY);
    divRef.current.style.top = divRef.current.offsetTop - pos2 + "px";
    divRef.current.style.left = divRef.current.offsetLeft - pos1 + "px";

    var newSteps;
    let offsetX = startX - e.clientX;
    let offsetY = startY - e.clientY;
    let parse = parseInt(offsetY / 140);
    let newYOffsetIndex = parse === 0 ? parse + index : (parse - index) * -1;
    // console.log("newYOffset", parse, newYOffsetIndex);
    newSteps =
      offsetX < 0
        ? Math.round(offsetX / cardSize) * -1
        : Math.round(offsetX / cardSize) * -1;

    if (currentMoveSilhouetteSteps !== newSteps) {
      // var yIndex = currentMoveSilhouetteYIndex;
      if (currentMoveSilhouetteYIndex !== newYOffsetIndex) {
        //yIndex = newYOffsetIndex;
        dispatch(showMoveCardSilhouette(statusId, newSteps, newYOffsetIndex));
        setCurrentMoveSilhouetteYIndex(newYOffsetIndex);
        setCurrentMoveSilhouetteSteps(newSteps);
      } else {
        dispatch(
          showMoveCardSilhouette(
            statusId,
            newSteps,
            currentMoveSilhouetteYIndex
          )
        );
        setCurrentMoveSilhouetteSteps(newSteps);
      }
    } else {
      if (currentMoveSilhouetteYIndex !== newYOffsetIndex) {
        //yIndex = newYOffsetIndex;
        dispatch(
          showMoveCardSilhouette(
            statusId,
            currentMoveSilhouetteSteps,
            newYOffsetIndex
          )
        );
        setCurrentMoveSilhouetteYIndex(newYOffsetIndex);
      } else {
        // yIndex = newYOffsetIndex;
        // setCurrentMoveSilhouetteYIndex(newYOffsetIndex);
        // dispatch(showMoveCardSilhouette(statusId, currentMoveSilhouetteSteps, yIndex));
      }
    }
  };

  const cardSize = 240;

  const dragEnd = (e) => {
    dispatch(hideMoveCardSilhouette());
    // divRef.current.style.top = startOffsetTop + "px";
    // divRef.current.style.left = startOffsetLeft + "px";
    let offsetX = startX - e.clientX;
    let offsetY = startY - e.clientY;
    var steps;
    if (offsetX > 100) {
      steps = -Math.round(offsetX / cardSize);
      modifyBug(bugId, statusId, steps);
    } else if (offsetX < -100) {
      steps = -Math.round(offsetX / cardSize);
      modifyBug(bugId, statusId, steps);
    } else {
      //console.log("offsetY", offsetY);
      //minus is down
      //get height of card
      //console.log(divRef.current.clientHeight);
      setPos({ x: 0, y: 0 });
    }
    setIsDragging(false);
  };

  const handleShowBugDetails = (bugId) => {
    if (!isDragging) {
      dispatch(showBug({ id: bugId }));
    }
  };

  return (
    <Grid
      ref={divRef}
      className={`${isDragging ? classes.draggingBugPaper : ""}`}
      item
    >
      <DraggableCore
        axis="both"
        // onStart={dragStart}
        onStop={dragEnd}
        onDrag={dragging}
        onMouseDown={dragStart}
        //position={pos}
      >
        <Paper className={`${classes.bugPaper}`} elevation={1}>
          <ProjectBoardCardTags bugTags={bugTags}></ProjectBoardCardTags>

          <Typography variant="subtitle2" color="initial">
            {bugName}
          </Typography>
          <div className={classes.bugChipParent}>
            <Chip
              clickable
              onClick={() => handleShowBugDetails(bugId)}
              size="small"
              avatar={<Avatar>F</Avatar>}
              label={bugId}
            />
          </div>
        </Paper>
      </DraggableCore>
    </Grid>
  );
};

export default ProjectBoardCard;
