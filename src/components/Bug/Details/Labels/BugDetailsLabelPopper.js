import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import IconButton from "@material-ui/core/IconButton";

import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import { Fade } from "@material-ui/core";
import BugDetailsLabelDetails from "./BugDetailsLabelDetails";
import { useState } from "react";
import { useRef } from "react";
const useStyles = makeStyles((theme) => ({
  paper: {
    border: "1px solid",

    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  popper: {
    zIndex: 2000,
  },
}));

const BugDetailsLabelPopper = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });
  const targetRef = useRef(null);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : targetRef.current);
    let boundingRect = event.currentTarget.getBoundingClientRect();
    setAnchorPos({ x: boundingRect.left + 30, y: boundingRect.top + 30 });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        aria-label="Add"
        size="small"
        onClick={handleClick}
      >
        <AddCircleRoundedIcon></AddCircleRoundedIcon>
      </IconButton>
      <div
        ref={targetRef}
        style={{
          position: "fixed",
          top: anchorPos.y,
          left: anchorPos.x,
          width: "1px",
        }}
      ></div>
      <Popper
        className={classes.popper}
        id={id}
        open={open}
        anchorEl={anchorEl}
      >
        {() => (
          <Fade in={open}>
            <BugDetailsLabelDetails
              close={() => setAnchorEl(null)}
              className={classes.paper}
            ></BugDetailsLabelDetails>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

export default BugDetailsLabelPopper;
