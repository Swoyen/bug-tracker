import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Chip,
  Avatar,
  CardContent,
  Card,
  CardActionArea,
  CardMedia,
  Input,
  Grow,
  Tooltip,
  Fade,
  Button,
  Divider,
} from "@material-ui/core";
import { DraggableCore } from "react-draggable";
import { makeStyles, IconButton } from "@material-ui/core";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBugListWithSameStatus,
  getBugsWithStatus,
  getMoveCardShownBugList,
  hideMoveCardSilhouette,
  modifyBugStatus,
  setCardHeight,
  showMoveCardSilhouette,
} from "../../../store/board";
import { modifyBug, showBug } from "../../../store/bug";
import ProjectBoardCardTags from "./ProjectBoardCardTags";
import { getBugById } from "../../../store/bugs";
import { BASE_URL, RESTRICTEDENDPOINTS } from "../../../api/config";
import { Edit as EditIcon, Settings as SettingsIcon } from "@material-ui/icons";
import { useTheme } from "@material-ui/core";
import LaunchIcon from "@material-ui/icons/Launch";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import DescriptionIcon from "@material-ui/icons/Description";
import ListRoundedIcon from "@material-ui/icons/ListRounded";
const useStyles = makeStyles((theme) => ({
  bugPaper: {
    minHeight: "50px",
    //borderRadius: "5px",
    margin: theme.spacing(1),
    position: "relative",
  },
  media: {
    height: 80,
  },
  draggingBugPaper: {
    width: "232px",
    position: "absolute",
    zIndex: 999,
    cursor: "grabbing !important",
  },
  editIcon: {
    position: "absolute",
    right: "0",
    top: "0",
  },
  cardText: {
    minHeight: "30px",
    marginRight: theme.spacing(2),
  },
  cardContent: {
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    position: "relative",
    minHeight: "50px",
    marginBottom: theme.spacing(5),
  },
  bugChipParent: {
    position: "absolute",
    right: 0,
    bottom: 0,
    borderTop: "1px solid black",
    borderColor: theme.palette.secondary.main,
    width: "100%",
  },
}));

var startX = 0;
var startY = 0;
var pos3 = 0;
var pos4 = 0;
var mouseOver = false;

const ProjectBoardCard = (props) => {
  const classes = useStyles();
  const { index, bugId, statusId } = props;

  const bug = useSelector(getBugById(bugId));
  const bugWithStatusList = useSelector(
    (state) => state.entities.board.bugsGroupedWithStatusList
  );
  const bugHeightMap = useSelector(
    (state) => state.entities.board.bugHeightMap
  );

  const bugListWithSameStatus = useSelector(getBugListWithSameStatus(statusId));

  const [currentMoveSilhouetteSteps, setCurrentMoveSilhouetteSteps] =
    useState(0);

  const [currentMoveSilhouetteYIndex, setCurrentMoveSilhouetteYIndex] =
    useState(index);

  // const moveCardYIndex = useSelector(state =>state.entities.board.moveCardYIndex)

  // const [pos1, setPos1] = useState(0);
  // const [pos2, setPos2] = useState(0);

  const gridRef = useRef(null);
  const divRef = useRef(null);
  const dispatch = useDispatch();

  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [height, setHeight] = useState(0);
  const [yOffsetInList, setYOffsetInlist] = useState(0);
  const [prevHeight, setPrevHeight] = useState(0);
  const [nextHeight, setNextHeight] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    return () => {
      // setStartX(0);
      // setStartY(0);
      setIsDragging(false);
      setPos({ x: 0, y: 0 });
    };
  }, []);

  const spaceBetween = 32;
  useEffect(() => {
    // console.log("here");
    if (
      index >= 0 &&
      bugListWithSameStatus.bugs.length > 0 &&
      bugHeightMap.length > 0 &&
      bug
    ) {
      if (bugHeightMap.some((bh) => bh.bugId === bugId)) {
        //console.log(bug.bugName);
        // find card height before it
        let cardsBefore = bugListWithSameStatus.bugs.filter(
          (b) => b.cardOrder < bug.cardOrder
        );
        let cardsAfter = bugListWithSameStatus.bugs.filter(
          (b) => b.cardOrder > bug.cardOrder
        );
        //console.log(cardsBefore);
        var yPosInList = 0;
        cardsBefore.forEach(
          (bug) =>
            (yPosInList =
              yPosInList +
              bugHeightMap.find((bh) => bh.bugId === bug.bugId).height +
              spaceBetween)
        );
        var prevCard = cardsBefore.at(-1);
        if (prevCard)
          setPrevHeight(
            bugHeightMap.find((bh) => bh.bugId === prevCard.bugId).height
          );

        var nextCard = cardsAfter.at(0);
        if (nextCard && nextCard.bugId) {
          var bug = bugHeightMap.find((bh) => bh.bugId === nextCard.bugId);
          var height = bug ? bug.height : 0;
          setNextHeight(height);
        }
        setYOffsetInlist(yPosInList);
      }
    }
  }, [bug, index, bugListWithSameStatus, statusId, bugHeightMap]);

  useEffect(() => {
    if (gridRef.current) {
      var h = gridRef.current.clientHeight - 16;
      //console.log(h);
      setHeight(h);
      dispatch(setCardHeight(statusId, bugId, h));
    }
  }, [gridRef]);

  const mouseDown = (e) => {
    if (isDragging) return;
    pos3 = e.clientX;
    pos4 = e.clientY;
    startX = e.clientX;
    startY = e.clientY;

    gridRef.current.style.top = gridRef.current.offsetTop - 8 + "px";
    gridRef.current.style.left = gridRef.current.offsetLeft + "px";
    //  height = divRef.current.clientHeight;
    setCurrentMoveSilhouetteYIndex(index);
    setCurrentMoveSilhouetteSteps(0);
    //
  };

  const dragStart = (e) => {};

  const dragging = (e) => {
    if (!isDragging) {
      dispatch(showMoveCardSilhouette(statusId, 0, index, height));
      setIsDragging(true);
    }

    var pos1 = pos3 - e.clientX;
    var pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    gridRef.current.style.top = gridRef.current.offsetTop - pos2 + "px";
    gridRef.current.style.left = gridRef.current.offsetLeft - pos1 + "px";

    var newSteps;
    let offsetX = startX - e.clientX;
    let offsetY = startY - e.clientY;

    newSteps =
      offsetX < 0
        ? Math.round(offsetX / cardSize) * -1
        : Math.round(offsetX / cardSize) * -1;

    var statusIndex = bugWithStatusList.findIndex(
      (bws) => bws.status.statusId === statusId
    );
    if (
      newSteps !== 0 &&
      statusIndex + newSteps !== -1 &&
      statusIndex + newSteps < bugWithStatusList.length
    ) {
      statusIndex = statusIndex + newSteps;
    }

    // make it negative to invert the numbers
    var offY = yOffsetInList + offsetY * -1;
    var newYOffsetIndex = index;

    var currentOffsetY = 0;
    var prevOffsetY = currentOffsetY;
    if (statusIndex === -1) return;
    if (!bugWithStatusList[statusIndex]) return;

    var currentStatusBugList = bugWithStatusList[statusIndex].bugs;

    var totalHeight =
      bugWithStatusList[statusIndex].totalHeight !== undefined
        ? bugWithStatusList[statusIndex].totalHeight +
          spaceBetween * bugWithStatusList[statusIndex].bugs.length
        : 0;
    // if (offY <= 0) {
    //   newYOffsetIndex = 0;
    // } else {
    console.log("Before loop", newYOffsetIndex);
    for (var i = 0; i < currentStatusBugList.length; i++) {
      var bugId = currentStatusBugList[i].bugId;
      var bugHeight = bugHeightMap.find((bh) => bh.bugId === bugId).height;
      currentOffsetY += bugHeight + spaceBetween;
      console.log("currentOffSety", currentOffsetY);
      if (Math.abs(offY) < currentOffsetY && Math.abs(offY) >= prevOffsetY) {
        console.log("i", i);
        if (offY <= 0) newYOffsetIndex -= i;
        else newYOffsetIndex += i;
        break;
      } else if (offY >= totalHeight) {
        newYOffsetIndex = currentStatusBugList.length;
        break;
      }
      prevOffsetY = currentOffsetY;
    }
    // }

    if (currentMoveSilhouetteSteps !== newSteps) {
      if (currentMoveSilhouetteYIndex !== newYOffsetIndex) {
        dispatch(
          showMoveCardSilhouette(
            statusId,
            newSteps,
            newYOffsetIndex,
            height,
            index < newYOffsetIndex
          )
        );
        console.log("In If", newYOffsetIndex);
        setCurrentMoveSilhouetteYIndex(newYOffsetIndex);
        setCurrentMoveSilhouetteSteps(newSteps);
      } else {
        dispatch(
          showMoveCardSilhouette(
            statusId,
            newSteps,
            currentMoveSilhouetteYIndex,
            height,
            index < newYOffsetIndex
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
            newYOffsetIndex,
            height,
            index < newYOffsetIndex
          )
        );
        setCurrentMoveSilhouetteYIndex(newYOffsetIndex);
      } else {
      }
    }
  };

  const cardSize = 240;

  const dragEnd = (e) => {
    dispatch(hideMoveCardSilhouette());
    let offsetX = startX - e.clientX;
    let offsetY = startY - e.clientY;
    var steps;
    if (offsetX > 100) {
      console.log("Here1");
      steps = -Math.round(offsetX / cardSize);
      dispatch(modifyBugStatus({ bugId, statusId, steps }));
    } else if (offsetX < -100) {
      console.log("Here2");
      steps = -Math.round(offsetX / cardSize);
      dispatch(modifyBugStatus({ bugId, statusId, steps }));
    } else {
      if (offsetY < 0) {
        if (Math.abs(offsetY) > nextHeight) {
          // console.log("go down");
          dispatch(
            modifyBugStatus({
              bugId,
              statusId,
              steps: 0,
              movedDownInSameStatus: true,
            })
          );
        }
      } else {
        if (Math.abs(offsetY) > prevHeight) {
          dispatch(
            modifyBugStatus({
              bugId,
              statusId,
              steps: 0,
            })
          );
        }
      }
    }
    setIsDragging(false);
  };

  const handleShowBugDetails = (bugId) => {
    if (!isDragging) {
      dispatch(showBug({ id: bugId }));
    }
  };

  const handleEdit = () => {
    setEditing((editing) => {
      if (editing && editingText !== bug.bugName && editingText !== "") {
        let newBug = { ...bug, bugName: editingText };
        dispatch(modifyBug(newBug.bugId, newBug));
      } else {
        setEditingText(bug.bugName);
      }
      return !editing;
    });
  };

  const [hovering, setHovering] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  return bug ? (
    <Grid
      ref={gridRef}
      className={`${isDragging ? classes.draggingBugPaper : ""}`}
      item
    >
      <div ref={divRef}>
        <DraggableCore
          disabled={editing}
          axis="both"
          onStart={dragStart}
          onStop={dragEnd}
          onDrag={dragging}
          onMouseDown={mouseDown}
          //position={pos}
        >
          <Card
            onMouseOver={() => {
              if (!hovering) setHovering(true);
            }}
            onMouseLeave={() => setHovering(false)}
            className={`${classes.bugPaper}`}
            elevation={1}
            component="div"
          >
            {bug.headerBackgroundSet ? (
              <CardMedia
                className={classes.media}
                image={`${BASE_URL}${RESTRICTEDENDPOINTS.IMAGE}/${bug.headerBackgroundImgSrc}`}
                title="Background"
              />
            ) : (
              ""
            )}
            <CardContent className={classes.cardContent}>
              <ProjectBoardCardTags
                style={{ marginRight: theme.spacing(2) }}
                bugId={bugId}
              ></ProjectBoardCardTags>
              <Fade in={hovering && !editing}>
                <IconButton
                  className={classes.editIcon}
                  size="small"
                  aria-label="settings"
                  onClick={handleEdit}
                >
                  <Tooltip title="edit">
                    <EditIcon fontSize="small" />
                  </Tooltip>
                </IconButton>
              </Fade>
              <Fade in={editing}>
                <IconButton
                  className={classes.editIcon}
                  size="small"
                  aria-label="settings"
                  onClick={handleEdit}
                >
                  <Tooltip title="edit">
                    <CheckCircleRoundedIcon color="primary" fontSize="small" />
                  </Tooltip>
                </IconButton>
              </Fade>
              <div className={classes.cardText}>
                {editing ? (
                  <Input
                    autoFocus={true}
                    multiline
                    fullWidth
                    margin="none"
                    style={{
                      fontSize: "14px",
                    }}
                    name="editing"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  ></Input>
                ) : (
                  <Typography variant="subtitle2" color="initial">
                    {bug.bugName}
                  </Typography>
                )}
              </div>
            </CardContent>
            <div className={classes.bugChipParent}>
              <Grid container justifyContent="flex-end" spacing={1}>
                <Grid item xs={6}>
                  {bug.checkListId && bug.totalCheckList !== 0 ? (
                    <Tooltip title="Contains Checklist">
                      <div>
                        <IconButton aria-label="description" size="small">
                          <ListRoundedIcon />
                        </IconButton>
                        <Typography
                          variant="subtitle2"
                          color="initial"
                          display="inline"
                        >
                          {`${bug.solvedCheckListItems}/${bug.totalCheckListItems}`}
                        </Typography>
                      </div>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={2}>
                  {bug.bugDescription && bug.bugDescription !== "" ? (
                    <Tooltip title="Contains description">
                      <IconButton aria-label="description" size="small">
                        <DescriptionIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item>
                  <Tooltip title="Open Bug">
                    <Button
                      variant="contained"
                      aria-label="Show"
                      size="small"
                      //style={{ display: hovering ? "initial" : "none" }}
                      onClick={() => handleShowBugDetails(bugId)}
                    >
                      <div>B-{bug.bugId}</div>
                      {/* <LaunchIcon fontSize="small" /> */}
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </div>
          </Card>
        </DraggableCore>
      </div>
    </Grid>
  ) : (
    ""
  );
};

export default ProjectBoardCard;
