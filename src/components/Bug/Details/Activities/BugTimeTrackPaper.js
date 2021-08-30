import { Chip, Paper } from "@material-ui/core";
import React from "react";

import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import { useTheme, Typography, Grid } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import { getDurationFromStartAndEnd } from "../../../../helper/timecalc";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  timeTags: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const BugTimeTrackPaper = ({ timeTrack }) => {
  const theme = useTheme();
  const classes = useStyles();
  const [duration, setDuration] = useState("0 h 0 mins");
  useEffect(() => {
    setDuration(
      getDurationFromStartAndEnd(timeTrack.startTime, timeTrack.stopTime)
    );
    console.log("time", timeTrack);
  }, [timeTrack]);
  return (
    <Paper
      style={{
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      }}
    >
      <Grid container spacing={1} justifyContent="space-between">
        <Grid item xs={3}>
          <AccessAlarmIcon></AccessAlarmIcon>
          <Typography variant="subtitle2" color="initial">
            {duration}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <AccountCircleIcon></AccountCircleIcon>
          <Typography variant="subtitle2" color="initial">
            {timeTrack.username}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Paper variant="outlined" className={classes.timeTags} component="ul">
            {timeTrack.bugTags.map((bugTag) => {
              return (
                <li key={bugTag.bugTagId}>
                  <Chip
                    clickable
                    variant="outlined"
                    label={bugTag.bugTagName}
                    className={classes.chip}
                  />
                </li>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BugTimeTrackPaper;
