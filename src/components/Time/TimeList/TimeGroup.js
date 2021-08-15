import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import TimePaper from "./TimePaper";
import React, { useState, useEffect, useContext } from "react";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUpRounded";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import TimeBugGroup from "./TimeBugGroup";
import { IsoOutlined } from "@material-ui/icons";
import { TimeContext } from "../../../context/TimeContext";

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
  const { timeGroupVisible, setTimeGroupVisible } = useContext(TimeContext);
  const { timeList: timeListWithDate, index } = props;
  const [dateStr, setDateStr] = useState(defaultDate);
  const [timeListWithSameDate, setTimeListWithSameDate] = useState({});
  const [duration, setDuration] = useState("00:00");
  const [
    timeListWithSameDateGroupedByBug,
    setTimeListWithSameDateGroupedByBug,
  ] = useState({});

  const [listVisible, setListVisible] = useState(false);
  // useEffect(() => )

  const getFormattedTimeFromSeconds = (totalSeconds) => {
    let hours = totalSeconds / 3600;
    let minutes = totalSeconds / 60;
    let seconds = totalSeconds % 60;
    let t = new Date(1970, 0, 1);
    t.setHours(hours);
    t.setMinutes(minutes);
    t.setSeconds(seconds);

    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();

    return `${h} h ${m} min`;

    return t.toLocaleTimeString();
  };

  useEffect(() => {
    if (timeListWithDate) {
      console.log("TLD", timeListWithDate);
      var totalDuration = 0;
      timeListWithDate.timeTrack.forEach((timeTrack) => {
        var startTime = new Date(timeTrack.startTime + "Z");
        var stopTime = new Date(timeTrack.stopTime + "Z");
        var duration = stopTime.getTime() - startTime.getTime();
        totalDuration += duration;
      });
      setDuration(getFormattedTimeFromSeconds(totalDuration / 1000));

      let dt = timeListWithDate.date;
      console.log("tt", timeListWithDate);
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
      setTimeListWithSameDate(timeListWithDate.timeTrack);

      var startBugId = timeListWithDate.timeTrack[0].bugId;
      var startTimeTrack = timeListWithDate.timeTrack[0];
      var startBugName = timeListWithDate.timeTrack[0].bugName;
      var prevTimeTrackBugId = startBugId;
      var timeTrackGroupedByBug = [];
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
          // var index = findLastIndex(
          //   timeTrackGroupedByBug.timeTrack,
          //   (timeTrackGroup) => timeTrackGroup.bugId === prevTimeTrackBugId
          // );

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
      setTimeListWithSameDateGroupedByBug(timeTrackGroupedByBug);

      let today = new Date();
      var secDiff = Math.abs(today.getTime() - d.getTime());
      var daysDiff = parseInt(secDiff / (24 * 3600 * 1000));

      if (daysDiff <= 1) {
        setListVisible(true);
      }
    }
  }, [timeListWithDate]);

  const toggleVisibility = () => {
    setListVisible(!listVisible);
    setTimeGroupVisible((timeGroupVisible) => {
      var temp = timeGroupVisible;
      temp[index] = !temp[index];
      return temp;
    });
    // setListVisible(!listVisible);
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
      <Grid container>
        {/* {listVisible && timeListWithSameDate.length > 0
          ? timeListWithSameDate.map((time) => {
              return (
                <Grid item xs={12} key={time.timeTrackId}>
                  <TimePaper time={time}></TimePaper>
                </Grid>
              );
            })
          : ""} */}

        {listVisible && timeListWithSameDateGroupedByBug.length > 0
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
    </Paper>
  );
};

export default TimeGroup;
