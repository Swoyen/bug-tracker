import {
  makeStyles,
  Paper,
  Grid,
  Typography,
  Avatar,
  Grow,
  Collapse,
} from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import TimePaper from "./TimePaper";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),

    marginRight: theme.spacing(1),

    background: "#EEEEEE",
    "&:hover": {
      cursor: "pointer",
    },
  },
  small: {
    // width: theme.spacing(2),
    // heigth: theme.spacing(1),
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: "5px",
  },
  grid: { minHeight: "50px" },
  timeGroup: { marginTop: theme.spacing(1) },
  header: {},
}));

const TimeGroupPaper = (props) => {
  const classes = useStyles();
  const { timeGroupByBug } = props;
  const [timeDuration, setTimeDuration] = useState("00:00");
  const [timeListShown, setTimeListShown] = useState(false);

  const toggleListVisibility = () => {
    setTimeListShown(!timeListShown);
  };
  const getFormattedTimeFromSeconds = (totalSeconds) => {
    let hours = totalSeconds / 3600;
    let minutes = totalSeconds / 60;
    let seconds = totalSeconds % 60;
    let t = new Date(1970, 0, 1);
    t.setHours(hours);
    t.setMinutes(minutes);
    t.setSeconds(seconds);
    return t.toLocaleTimeString();
  };

  useEffect(() => {
    if (timeGroupByBug) {
      var totalDuration = 0;
      timeGroupByBug.timeTracks.forEach((timeTrack) => {
        var startTime = new Date(timeTrack.startTime + "Z");
        var stopTime = new Date(timeTrack.stopTime + "Z");
        var duration = stopTime.getTime() - startTime.getTime();
        totalDuration += duration;
      });
      setTimeDuration(getFormattedTimeFromSeconds(totalDuration / 1000));
    }
  }, [timeGroupByBug]);

  return (
    <Paper className={classes.root}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
        className={classes.grid}
      >
        <Grid
          item
          container
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
          onClick={() => toggleListVisibility()}
          xs={12}
        >
          <Grid
            item
            container
            sm={10}
            className={classes.timeDetail}
            alignItems="center"
            className={classes.header}
          >
            <Grid item xs={1}>
              <Avatar variant="square" className={classes.small}>
                {timeGroupByBug.timeTracks.length}
              </Avatar>
            </Grid>
            <Grid item>
              {timeGroupByBug.bugName ? (
                <Typography variant="subtitle1">
                  {timeGroupByBug.bugName}
                </Typography>
              ) : (
                <Typography variant="subtitle2">+ Add details</Typography>
              )}
            </Grid>
          </Grid>
          <Grid item sm={2} container justifyContent="center">
            <Typography variant="subtitle1" color="initial" align="right">
              {timeDuration}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Collapse in={timeListShown}>
        <Grid item xs={12} container className={classes.timeGroup}>
          {timeGroupByBug.timeTracks
            ? timeGroupByBug.timeTracks.map((time) => {
                return (
                  <Grid item xs={12} key={time.timeTrackId}>
                    <TimePaper time={time}></TimePaper>
                  </Grid>
                );
              })
            : ""}
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default TimeGroupPaper;
