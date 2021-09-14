import React, { useState, useEffect } from "react";

import { makeStyles, Paper, Grid, Typography } from "@material-ui/core";
import TimeChipArray from "./TimeChipArray";
import { setTimeTrackEditShown } from "../../../store/timeTrack";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#c1c1c1",
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.primary.light,
    },
  },
  actionButton: {
    margin: "none",
    "& *": { padding: "none" },
  },
  grid: {
    minHeight: "60px",
  },
  alarmIcon: {
    marginTop: 2,
    paddingRight: theme.spacing(1),
  },
  timeDetail: {
    paddingLeft: theme.spacing(1),
  },
}));

const TimePaper = (props) => {
  const classes = useStyles();
  const { time } = props;
  const dispatch = useDispatch();

  const [timeDuration, setTimeDuration] = useState("00:00");

  useEffect(() => {
    const getFormattedTimeFromSeconds = (totalSeconds) => {
      let hours = parseInt(totalSeconds / 3600);
      // console.log("Hours", hours);
      let minutes = parseInt(Math.abs(hours * 60 - totalSeconds / 60));
      let seconds = totalSeconds % 60;
      let t = new Date(1970, 0, 1);
      t.setHours(hours);
      t.setMinutes(minutes);
      t.setSeconds(seconds);
      return t.toLocaleTimeString();
    };

    let date1 = new Date(time.startTime);
    let date2 = new Date(time.stopTime);
    let diffTime = Math.abs(date2 - date1);
    setTimeDuration(getFormattedTimeFromSeconds(diffTime / 1000));
  }, [time.startTime, time.stopTime]);

  const handleEditTimeTrack = (timeTrackId) => {
    // setTimeTrackIdToEdit(timeTrackId);
    // setOpenTimeEdit(true);
    dispatch(setTimeTrackEditShown(true, timeTrackId));
  };

  return (
    <Paper className={classes.root}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
      >
        <Grid
          item
          className={classes.grid}
          onClick={() => handleEditTimeTrack(time.timeTrackId)}
          container
          xs={12}
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
        >
          {/* <Grid item sm={1}>
            <Typography>{time.timeTrackId}</Typography>
          </Grid> */}
          <Grid item sm={10} className={classes.timeDetail}>
            {time.bugName ? (
              <>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography variant="subtitle2"> {time.bugName}</Typography>
                  </Grid>
                  <Grid item>
                    <TimeChipArray tags={time.bugTags}></TimeChipArray>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="subtitle2">+ Add details</Typography>
                </Grid>
                <Grid item>
                  <TimeChipArray tags={time.bugTags}></TimeChipArray>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item sm={2} container justifyContent="center">
            <Typography variant="subtitle2" color="initial" align="right">
              {timeDuration}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="space-evenly"
          item
          xs={2}
          alignItems="center"
        ></Grid>
      </Grid>
    </Paper>
  );
};

export default TimePaper;
