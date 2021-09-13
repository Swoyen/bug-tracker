import {
  Grid,
  Paper,
  useTheme,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";

const ProjectDoughnutChart = () => {
  const data = useSelector((state) => state.entities.report.timeTrackBugReport);
  const theme = useTheme();
  return data.datasets ? (
    <Paper
      style={{
        minWidth: 300,
        minHeight: 300,
        maxHeight: 340,
        maxWidth: 300,
        padding: theme.spacing(1),
      }}
      elevation={2}
    >
      {data &&
      data.datasets &&
      data.datasets[0].data &&
      data.datasets[0].data.length > 0 ? (
        <Grid container>
          <Grid item xs={12}>
            <Typography align="center" variant="h6" color="initial">
              Hours Per Issue
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Doughnut data={data} />
          </Grid>
        </Grid>
      ) : (
        <Typography align="center" variant="h6" color="initial">
          No Issues In This week
        </Typography>
      )}
    </Paper>
  ) : (
    <CircularProgress />
  );
};

export default ProjectDoughnutChart;
