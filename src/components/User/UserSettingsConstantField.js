import { Grid, Typography } from "@material-ui/core";
import React from "react";

const UserSettingsConstantField = ({ label, value }) => {
  return (
    <Grid
      container
      item
      xs={12}
      style={{ marginTop: "8px" }}
      alignItems="center"
    >
      <Grid item xs={3}>
        <Typography variant="body1" color="initial">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="subtitle1" color="initial">
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default UserSettingsConstantField;
