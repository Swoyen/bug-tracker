import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import React from "react";

import BugDetailsLabelPopper from "./BugDetailsLabelPopper";
import { useDispatch, useSelector } from "react-redux";
import BugDetailsLabelChip from "./BugDetailsLabelChip";

import { useTheme } from "@material-ui/styles";
import { modifyBug } from "../../../../store/bug";

const BugDetailsLabels = () => {
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
