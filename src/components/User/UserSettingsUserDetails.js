import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import UserSettingsConstantField from "./UserSettingsConstantField";
import UserSettingsUsername from "./UserSettingsUsername";

const UserSettingsUserDetails = () => {
  const currentUser = useSelector(
    (state) => state.entities.auth.apiUserDetails
  );
  return (
    <Grid container direction="column" justifyContent="space-between">
      <Grid item style={{ height: "50px" }}>
        <UserSettingsUsername />
      </Grid>
      <Grid item style={{ height: "50px" }}>
        <UserSettingsConstantField
          label={"Full Name *"}
          value={currentUser.fullName}
        />
      </Grid>
      <Grid item style={{ height: "50px" }}>
        <UserSettingsConstantField
          label={"Email *"}
          value={currentUser.email}
        />
      </Grid>
      <Grid item>
        <Typography variant="caption" color="initial">
          * Values Obtained from Microsoft Graph API
        </Typography>
      </Grid>
    </Grid>
  );
};

export default UserSettingsUserDetails;
