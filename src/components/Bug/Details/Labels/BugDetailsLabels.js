import { Divider, Fade, Grid, makeStyles, Paper } from "@material-ui/core";
import { Chip, Typography, IconButton } from "@material-ui/core";
import React from "react";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { Popper } from "@material-ui/core";
import { useState } from "react";
import BugDetailsLabelPopper from "./BugDetailsLabelPopper";
import { useDispatch, useSelector } from "react-redux";
import BugDetailsLabelChip from "./BugDetailsLabelChip";

import { useTheme } from "@material-ui/styles";
import { removeLabel } from "../../../../store/labels";
import { modifyBug } from "../../../../store/bug";
const useStyles = makeStyles((theme) => ({
  bugTag: {},
  deleteIcon: {},
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    zIndex: 1003300,
    position: "absolute",
  },
}));

const BugDetailsLabels = () => {
  const classes = useStyles();
  const loadedBug = useSelector((state) => state.entities.bug.loadedBug);

  const dispatch = useDispatch();
  const theme = useTheme();

  const handleDelete = (id) => {
    var labels = loadedBug.labels;
    labels = labels.filter((l) => l.labelId !== id);
    var newBug = {
      ...loadedBug,
      labels: labels,
    };
    dispatch(modifyBug(loadedBug.bugId, newBug));
  };

  return (
    <>
      <Typography variant="subtitle1">Labels:</Typography>
      <Grid
        style={{ marginBottom: theme.spacing(1) }}
        container
        alignItems="center"
        spacing={1}
      >
        {loadedBug.labels &&
          loadedBug.labels.map((label) => (
            <BugDetailsLabelChip
              key={label.labelId}
              label={label}
              handleDelete={handleDelete}
              canDelete={!loadedBug.resolved}
            />
          ))}
        {loadedBug.resolved ? (
          ""
        ) : (
          <BugDetailsLabelPopper></BugDetailsLabelPopper>
        )}
      </Grid>
    </>
  );
};

export default BugDetailsLabels;
