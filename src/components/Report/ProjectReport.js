import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";

import ProjectDoughnutChart from "./ProjectDoughnutChart";
import { Grid, IconButton } from "@material-ui/core";
import ProjectLineChart from "./ProjectLineChart";
import ProjectVerticalBar from "./ProjectVerticalBar";
import { useSelector } from "react-redux";
import {
  loadBugReportNextWeekFromProjectId,
  loadBugReportPrevWeekFromProjectId,
  loadTimeTrackReportNextWeek,
  loadTimeTrackReportPrevWeek,
} from "../../store/reports";
import { useDispatch } from "react-redux";

import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { DateTime } from "luxon";
const ProjectReport = () => {
  const dispatch = useDispatch();
  const reportWeek = useSelector(
    (state) => state.entities.report.timeTrackReportWeek
  );
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );
  const userId = useSelector((state) => state.entities.auth.userId);

  const [weekText, setWeekText] = useState("This week");

  useEffect(() => {
    if (reportWeek !== -1) {
      var currentWeek = DateTime.now().weekNumber;
      if (reportWeek === currentWeek) {
        setWeekText("This week");
      } else if (reportWeek === currentWeek - 1) {
        setWeekText("Last week");
      } else if (reportWeek < currentWeek - 1) {
        var weekDiff = currentWeek - reportWeek;
        setWeekText(`${weekDiff} weeks ago`);
      }
    }
  }, [reportWeek]);

  const handleShowPrevWeekReport = () => {
    dispatch(loadTimeTrackReportPrevWeek(projectId, userId));
    dispatch(loadBugReportPrevWeekFromProjectId(projectId, userId));
  };

  const handleShowNextWeekReport = () => {
    dispatch(loadTimeTrackReportNextWeek(projectId, userId));
    dispatch(loadBugReportNextWeekFromProjectId(projectId, userId));
  };
  return (
    <div style={{ textAlign: "left" }}>
      <Typography variant="h5" color="initial">
        Project Report
      </Typography>

      <Grid container justifyContent="space-around" spacing={1}>
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton aria-label="prevweek" onClick={handleShowPrevWeekReport}>
            <ArrowBackIosRoundedIcon />
          </IconButton>
          <Typography variant="subtitle1" color="initial">
            {weekText}
          </Typography>
          <IconButton aria-label="nextweek" onClick={handleShowNextWeekReport}>
            <ArrowBackIosRoundedIcon style={{ transform: "rotate(180deg)" }} />
          </IconButton>
        </Grid>
        <Grid item sm={7}>
          <ProjectVerticalBar />
        </Grid>
        <Grid item sm={4}>
          <ProjectDoughnutChart />
        </Grid>
        <Grid item xs={12}>
          <ProjectLineChart />
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectReport;
