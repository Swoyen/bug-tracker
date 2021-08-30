import { Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React from "react";
import BugDetailsActivitiesTab from "./BugDetailsActivitiesTab";

const BugDetailActivities = () => {
  return (
    <Grid
      item
      xs={12}
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={12}>
        <Typography variant="subtitle1">Activities</Typography>
      </Grid>
      <Grid item xs={12}>
        <BugDetailsActivitiesTab />
      </Grid>
    </Grid>
  );
};

export default BugDetailActivities;
