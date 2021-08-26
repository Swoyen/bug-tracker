import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React from "react";
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
      <Grid item container xs={12}>
        <Grid
          container
          item
          xs={12}
          alignItems="flex-end"
          direction="row-reverse"
          justifyContent="flex-start"
        >
          <BugDetailsButtonGroup />
        </Grid>
      </Grid>

      <BugDetailsProperties />
    </Grid>
  );
};

export default BugDetailsActionProperties;
