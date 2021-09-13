import { Button, Grid, Paper, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import UserDoughnutChart from "./UserDoughnutChart";
import UserSummaryList from "./UserSummaryList";
import UserSummaryLoadButton from "./UserSummaryLoadButton";

const UserSummary = () => {
  return (
    <>
      <Typography gutterBottom align="left" variant="h5">
        User Summary
      </Typography>
      <Grid container spacing={1}>
        <Grid
          item
          sm={8}
          xs={12}
          style={{ maxHeight: "80vh", overflow: "auto" }}
        >
          <UserSummaryList />
          <UserSummaryLoadButton />
        </Grid>
        <Grid item sm={4}>
          <UserDoughnutChart />
        </Grid>
        <Grid item sm={12}>
          <Paper style={{ padding: "8px" }}>
            <Typography variant="subtitle1">More work needed..</Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default UserSummary;
