import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  IconButton,
  Collapse,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUpRounded";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import TimeBugGroup from "./TimeBugGroup";

import { getDurationFromArray } from "../../../helper/timecalc";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  header: {
    cursor: "pointer",
  },
  dateName: {},
  toggleButton: {
    marginRight: theme.spacing(1),
  },
}));

let defaultDate = "Sun, 12 Jan";
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TimeGroup = (props) => {
  const classes = useStyles();
  const { timeList: timeListWithDate } = props;

  const [dateStr, setDateStr] = useState(defaultDate);
  const [duration, setDuration] = useState("00:00");
  const [
    timeListWithSameDateGroupedByBug,
    setTimeListWithSameDateGroupedByBug,
  ] = useState({});
  const [listVisible, setListVisible] = useState(false);

  useEffect(() => {
    if (timeListWithDate) {
      var startEnd = [];
      timeListWithDate.timeTrack.forEach((timeTrack) =>
        startEnd.push({
          startTime: timeTrack.startTime,
          endTime: timeTrack.stopTime,
        })
      );

      setDuration(getDurationFromArray(startEnd));

      let dt = timeListWithDate.date;
      setListVisible(timeListWithDate.visible);
      let d = new Date(dt.year, dt.month, dt.date);

      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      let date = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      let day = d.getDay();
      let dayName = days[day];
      let dateStr = dayName + ", " + date + " " + month;
      var current = new Date();
      if (d.getDate() === current.getDate()) {
        setDateStr("Today");
      } else setDateStr(dateStr);
      //setTimeListWithSameDate(timeListWithDate.timeTrack);
      var timeTrackGroupedByBug = [];
      if (timeListWithDate.timeTrack.length > 0) {
        var startBugId = timeListWithDate.timeTrack[0].bugId;
        var startTimeTrack = timeListWithDate.timeTrack[0];
        var startBugName = timeListWithDate.timeTrack[0].bugName;
        var prevTimeTrackBugId = startBugId;

        timeTrackGroupedByBug.push({
          bugId: startBugId,
          timeTracks: [startTimeTrack],
          bugName: startBugName,
        });
        timeListWithDate.timeTrack.forEach((element) => {
          if (prevTimeTrackBugId !== element.bugId) {
            timeTrackGroupedByBug.push({
              bugId: element.bugId,
              bugName: element.bugName,
              timeTracks: [element],
            });
            prevTimeTrackBugId = element.bugId;
          } else {
            var reversed = timeTrackGroupedByBug.reverse();
            var reversedIndex = reversed.findIndex(
              (timeTrackGroup) => timeTrackGroup.bugId === prevTimeTrackBugId
            );
            var index = timeTrackGroupedByBug.length - reversedIndex - 1;
            timeTrackGroupedByBug.reverse();
            var temp = timeTrackGroupedByBug[index].timeTracks;
            if (!temp.some((tt) => tt.timeTrackId === element.timeTrackId)) {
              temp = [...temp, element];
              timeTrackGroupedByBug[index].timeTracks = temp;
            }
          }
        });
      }
      setTimeListWithSameDateGroupedByBug(timeTrackGroupedByBug);

      // if (daysDiff <= 1) {
      //   setListVisible(true);
      // }
    }
  }, [timeListWithDate, timeListWithDate.length]);

  const toggleVisibility = () => {
    setListVisible(!listVisible);
  };

  return (
    <Paper className={classes.root}>
      <Grid
        className={classes.header}
        onClick={() => toggleVisibility()}
        container
        justifyContent="center"
        alignContent="space-between"
      >
        <Grid item xs>
          <Typography
            className={classes.dateName}
            variant="subtitle1"
            color="initial"
          >
            {dateStr}
          </Typography>
        </Grid>
        <Grid
          item
          container
          sm={4}
          xs={6}
          alignContent="flex-end"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="subtitle1">{duration}</Typography>
          </Grid>
          <Grid item>
            <IconButton
              className={classes.toggleButton}
              size="small"
              aria-label="Toggle Visibility"
              onClick={() => toggleVisibility()}
            >
              {listVisible ? (
                <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
              ) : (
                <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
              )}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>

      <Collapse in={listVisible}>
        <Grid container>
          {timeListWithSameDateGroupedByBug.length > 0
            ? timeListWithSameDateGroupedByBug.map((timeGroupByBug, index) => {
                return (
                  <TimeBugGroup
                    key={index}
                    timeGroupByBug={timeGroupByBug}
                  ></TimeBugGroup>
                );
              })
            : ""}
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default TimeGroup;
