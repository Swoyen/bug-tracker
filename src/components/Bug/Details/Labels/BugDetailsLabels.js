import { Divider, Fade, Grid, makeStyles, Paper } from "@material-ui/core";
import { Chip, Typography, IconButton } from "@material-ui/core";
import React from "react";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { Popper } from "@material-ui/core";
import { useState } from "react";
import BugDetailsTagPopper from "./BugDetailsTagPopper";

const useStyles = makeStyles((theme) => ({
  bugTag: {
    marginRight: theme.spacing(0.5),
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
  deleteIcon: { color: theme.palette.secondary.dark },
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    zIndex: 1003300,
    position: "absolute",
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

const BugDetailsLabels = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleDelete = (id) => {};
  const handleAdd = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    console.log(anchorEl);
  };
  const open = Boolean(anchorEl);
  const id = open ? "transitions-popper" : undefined;

  return (
    <>
      <Typography variant="subtitle1">Labels:</Typography>
      <Grid container alignItems="center">
        {bugTags.map((bugTag) => (
          <Chip
            key={bugTag.id}
            className={classes.bugTag}
            label={bugTag.name}
            onDelete={() => handleDelete(bugTag.id)}
            style={{ background: bugTag.color }}
            deleteIcon={
              <HighlightOffRoundedIcon className={classes.deleteIcon} />
            }
          ></Chip>
        ))}

        {/* <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <div className={classes.paper}>Contents of this paper</div>
            </Fade>
          )}
        </Popper> */}
        <BugDetailsTagPopper></BugDetailsTagPopper>
      </Grid>
    </>
  );
};

export default BugDetailsLabels;
