import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Typography from "@material-ui/core/Typography";
import { useDispatch } from "react-redux";
import {
  loadTimeTrackReport,
  loadTimeTrackReportNextWeek,
  loadTimeTrackReportPrevWeek,
} from "../../store/reports";
import { useSelector } from "react-redux";
import { getDurationFromHours } from "../../helper/timecalc";
import { Grid, IconButton, Paper } from "@material-ui/core";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { DateTime } from "luxon";
import { useTheme } from "@material-ui/styles";

const options = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          var hours = context.parsed.y;

          var parsed = "Total: " + getDurationFromHours(hours);
          return parsed;
        },
      },
    },
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: false,
        },
      },
    ],
  },
};

const ProjectVerticalBar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );
  const userId = useSelector((state) => state.entities.auth.userId);
  const data = useSelector((state) => state.entities.report.timeTrackReport);

  useEffect(() => {
    if (projectId !== -1 && userId)
      dispatch(loadTimeTrackReport(projectId, userId));
  }, [projectId, userId]);

  return (
    <>
      <Paper
        style={{
          padding: theme.spacing(1),
        }}
      >
        <Typography align="center" variant="h6" color="initial">
          Total Hours worked
        </Typography>

        <Bar data={data} options={options} />
      </Paper>
    </>
  );
};

export default ProjectVerticalBar;
