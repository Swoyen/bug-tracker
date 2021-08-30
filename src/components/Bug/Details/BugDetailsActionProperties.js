import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Button from "../../../controls/Button";
import BugDetailsButtonGroup from "./BugDetailsButtonGroup";
import BugDetailsProperties from "./BugDetailsProperties";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    maxHeight: "300px",
  },
}));

const BugDetailsActionProperties = () => {
  const classes = useStyles();

  const { loadedBug } = useSelector((state) => state.entities.bug);
  return (
    <Grid
      className={classes.root}
      item
      container
      xs={5}
      spacing={2}
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Grid
        item
        container
        xs={12}
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
      >
        <Grid
          container
          item
          xs
          alignItems="center"
          alignContent="center"
          direction="row-reverse"
          justifyContent="flex-start"
        >
          {loadedBug.resolved ? "" : <BugDetailsButtonGroup />}
        </Grid>
      </Grid>

      <BugDetailsProperties />
    </Grid>
  );
};

export default BugDetailsActionProperties;
