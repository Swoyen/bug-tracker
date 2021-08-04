import {
  Paper,
  Grid,
  Typography,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import TimePaper from "./TimePaper";
import React, { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUpRounded";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDownRounded";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
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
  const [timeListWithSameDate, setTimeListWithSameDate] = useState({});
  const [listVisible, setListVisible] = useState(false);

  useEffect(() => {
    if (timeListWithDate) {
      let dt = timeListWithDate.date;
      let d = new Date(dt.year, dt.month, dt.date);

      let month = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      let date = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      let day = d.getDay();
      let dayName = days[day];
      let dateStr = dayName + ", " + date + " " + month;
      setDateStr(dateStr);
      setTimeListWithSameDate(timeListWithDate.timeTrack);

      let today = new Date();
      var secDiff = Math.abs(today.getTime() - d.getTime());
      var daysDiff = parseInt(secDiff / (24 * 3600 * 1000));
      console.log(daysDiff);

      if (daysDiff <= 2) {
        setListVisible(true);
      }
    }
  }, [timeListWithDate]);

  const toggleVisibility = () => {
    setListVisible(!listVisible);
  };

  return (
    <Paper className={classes.root}>
      <Grid container justifyContent="center" alignContent="space-between">
        <Grid item xs>
          <Typography
            className={classes.dateName}
            variant="subtitle1"
            color="initial"
          >
            {dateStr}
          </Typography>
        </Grid>
        <Grid item xs style={{ textAlign: "right" }}>
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
      <Grid container>
        {listVisible && timeListWithSameDate.length > 0
          ? timeListWithSameDate.map((time) => {
              return (
                <Grid item xs={12} key={time.timeTrackId}>
                  <TimePaper time={time}></TimePaper>
                </Grid>
              );
            })
          : ""}
      </Grid>
    </Paper>
  );
};

export default TimeGroup;
