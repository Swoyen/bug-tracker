import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    listStyle: "none",
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const TimeChipArray = (props) => {
  const { tags } = props;
  const classes = useStyles();

  return (
    <>
      <Grid item xs={12} className={classes.root}>
        {tags
          ? tags.map((data) => {
              return (
                <li key={data.bugTagId}>
                  <Chip label={data.bugTagName} className={classes.chip} />
                </li>
              );
            })
          : ""}
      </Grid>
    </>
  );
};

export default TimeChipArray;
