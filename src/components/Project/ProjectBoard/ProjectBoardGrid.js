import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles, Typography } from "@material-ui/core";

import ProjectBoardCard from "./ProjectBoardCard";
import ProjectBoardCardAdd from "./ProjectBoardCardAdd";
import {
  getBugsGroupedWithStatus,
  getMoveCardSilhouetteIndex,
  modifyBugStatus,
} from "../../../store/board";
import { useDispatch, useSelector } from "react-redux";
import ProjectBoardCardMoveSilhouette from "./ProjectBoardCardMoveSilhouette";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    background: "#c1c1c1",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    padding: theme.spacing(1),
    marginBottom: "3px",
  },
  boardGrid: {
    borderRadius: "10px",
    // width: "300px",
    margin: theme.spacing(0.5),
    background: "#eae9e9",
  },
  moveCard: {
    position: "absolute",
    minWidth: "235px",
  },
}));

const ProjectBoardGrid = (props) => {
  const { status, title, index } = props;
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const itemsRef = useRef([]);

  const [moveCardIndexInGrid, setMoveCardIndexInGrid] = useState(-1);

  const { index: moveCardIndex, yIndex } = useSelector(
    getMoveCardSilhouetteIndex
  );
  const bugsWithSameStatus = useSelector(
    getBugsGroupedWithStatus(status.statusId)
  );

  useEffect(() => {
    if (moveCardIndex === index) {
      //setMoveCardSilhouetteVisible(true);

      console.log("y Index", yIndex);
      var heightToMoveTo = yIndex * 152;

      console.log("h", heightToMoveTo);
      setMoveCardIndexInGrid(yIndex);
    } else {
      //setMoveCardSilhouetteVisible(false);
      setMoveCardIndexInGrid(-1);
    }
  }, [moveCardIndex, yIndex]);

  useEffect(() => {
    if (bugsWithSameStatus) {
      itemsRef.current = itemsRef.current.slice(0, bugsWithSameStatus.length);
    }
  }, [bugsWithSameStatus]);

  const handleModifyBug = (bugId, statusId, steps) => {
    dispatch(modifyBugStatus({ bugId, statusId, steps }));
  };

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
      {/* <div  ref={moveCardSilhouetteRef}>
        <ProjectBoardCardMoveSilhouette className={classes.moveCard}visible={moveCardSilhouetteVisible} />
      </div> */}
      {bugsWithSameStatus &&
        bugsWithSameStatus.bugs.map((bug, i) => {
          return (
            <div key={bug.bugId} ref={(el) => (itemsRef.current[i] = el)}>
              {moveCardIndexInGrid === i ? (
                <ProjectBoardCardMoveSilhouette
                  className={classes.moveCard}
                  visible={true}
                />
              ) : (
                ""
              )}
              <ProjectBoardCard
                bug={bug}
                index={i}
                key={bug.bugId}
                bugId={bug.bugId}
                bugName={bug.bugName}
                statusId={status.statusId}
                modifyBug={handleModifyBug}
              ></ProjectBoardCard>
            </div>
          );
        })}
      {bugsWithSameStatus &&
      moveCardIndexInGrid >= bugsWithSameStatus.bugs.length ? (
        <ProjectBoardCardMoveSilhouette
          className={classes.moveCard}
          visible={true}
        />
      ) : (
        ""
      )}
      <ProjectBoardCardAdd index={index} status={status}></ProjectBoardCardAdd>
    </Grid>
  );
};

export default ProjectBoardGrid;
