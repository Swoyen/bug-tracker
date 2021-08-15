import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Input, InputLabel, makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useEffect } from "react";
import TimePicker from "./TimePicker";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  calendar: { position: "fixed" },
  grid: {
    padding: theme.spacing(1),
  },
  datePicker: {},
}));

export default function TimeDatePicker(props) {
  const classes = useStyles();
  const { timeTracker, setTimerTracker, setValues } = props;
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(
    new Date("2014-08-18T21:11:54")
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    new Date("2014-08-18T21:11:54")
  );

  const [selectedStartTimeObj, setSelectedStartTimeObj] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [selectedEndTimeObj, setSelectedEndTimeObj] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [duration, setDuration] = useState("00:00");

  useEffect(() => {
    // only change the time
    if (timeTracker !== null && Object.keys(timeTracker).length !== 0) {
      // console.log(timeTracker);
      var startDate = new Date(timeTracker.startTime + "Z");
      // setSelectedStartTime(startDate);

      setSelectedStartTimeObj({
        years: startDate.getFullYear(),
        months: startDate.getMonth(),
        date: startDate.getDate(),
        hours: startDate.getHours(),
        minutes: startDate.getMinutes(),
        seconds: startDate.getSeconds(),
      });

      var endDate = new Date(timeTracker.stopTime + "Z");
      // setSelectedEndTime(endDate);

      setSelectedEndTimeObj({
        years: endDate.getFullYear(),
        months: endDate.getMonth(),
        date: endDate.getDate(),
        hours: endDate.getHours(),
        minutes: endDate.getMinutes(),
        seconds: endDate.getSeconds(),
      });
      setSelectedDate(startDate);
    }
    return () => {};
  }, [timeTracker]);

  useEffect(() => {}, [selectedDate]);

  useEffect(() => {
    var startHours = selectedStartTimeObj.hours;
    var startMinutes = selectedStartTimeObj.minutes;
    var startSeconds = selectedStartTimeObj.seconds;

    setSelectedStartTime((startDate) => {
      let temp = startDate;
      temp.setHours(startHours);
      temp.setMinutes(startMinutes);
      temp.setSeconds(startSeconds);
      return temp;
    });

    setSelectedEndTimeObj((selectedEndTimeObj) => {
      // console.log(selectedEndTimeObj);
      var endHours = selectedEndTimeObj.hours;
      var endMinutes = selectedEndTimeObj.minutes;
      var endSeconds = selectedEndTimeObj.seconds;
      if (
        startHours > endHours ||
        (startHours === endHours && startMinutes > endMinutes) ||
        (startHours === endHours &&
          startMinutes === endMinutes &&
          startSeconds > endSeconds)
      ) {
        return { ...selectedStartTimeObj };
      } else {
        return selectedEndTimeObj;
      }
    });
  }, [selectedStartTimeObj]);

  useEffect(() => {
    const getFormattedTimeFromSeconds = (totalSeconds) => {
      // console.log("Seconds", totalSeconds);
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
    var startHours = selectedStartTimeObj.hours;
    var startMinutes = selectedStartTimeObj.minutes;
    var startSeconds = selectedStartTimeObj.seconds;

    var endHours = selectedEndTimeObj.hours;
    var endMinutes = selectedEndTimeObj.minutes;
    var endSeconds = selectedEndTimeObj.seconds;

    var startDate = new Date();
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(startSeconds);

    var endDate = new Date();
    endDate.setHours(endHours);
    endDate.setMinutes(endMinutes);
    endDate.setSeconds(endSeconds);

    var timeDiffInMs = endDate.getTime() - startDate.getTime();
    var timeDiffInS = timeDiffInMs / 1000;

    setDuration(getFormattedTimeFromSeconds(timeDiffInS));
    var totalSeconds = timeDiffInS;
    let hours = parseInt(totalSeconds / 3600);
    let minutes = parseInt(Math.abs(hours * 60 - totalSeconds / 60));
    let seconds = totalSeconds % 60;

    var startYears = selectedStartTimeObj.years;
    var startMonths = selectedStartTimeObj.months;
    var startDate = selectedStartTimeObj.date;
    var dt = new Date(
      startYears,
      startMonths,
      startDate,
      startHours,
      startMinutes,
      startSeconds
    );
    var m = moment(dt);
    var endDateMoment = m.add({
      hours: hours < 0 ? hours + 24 : hours,
      minutes: minutes,
      seconds: seconds,
    });
    var startDateTime = dt;
    var endDateTime = endDateMoment._d;
    setSelectedEndTime(endDateMoment._d);
    setValues((values) => {
      return {
        ...values,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
      };
    });
  }, [selectedStartTimeObj, selectedEndTimeObj]);

  const handleDateChange = (date) => {
    if (date != null) {
      var newMonth = date.getMonth();
      var newYear = date.getYear();
      var newDate = date.getDate();

      setSelectedStartTimeObj((selectedStartTimeObj) => {
        return {
          ...selectedStartTimeObj,
          date: newDate,
          year: newYear,
          month: newMonth,
        };
      });
      setSelectedDate(date);
    }
  };

  return (
    <Grid container justifyContent="space-around" spacing={1}>
      <Grid
        item
        xs={12}
        container
        alignContent="flex-start"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Grid item sm={4} className={classes.grid}>
          <TimePicker
            label="Start"
            time={selectedStartTime}
            otherTime={selectedEndTime}
            isStart={true}
            setTimeObj={setSelectedStartTimeObj}
            timeObj={selectedStartTimeObj}
          ></TimePicker>
        </Grid>
        <Grid item sm={4} className={classes.grid}>
          <TimePicker
            label="Stop"
            time={selectedEndTime}
            otherTime={selectedStartTime}
            isStart={false}
            setTimeObj={setSelectedEndTimeObj}
            timeObj={selectedEndTimeObj}
          ></TimePicker>
        </Grid>
        <Grid item sm={4} className={classes.grid}>
          <TextField
            disabled
            id="duration"
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            error={false}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} container>
        <Grid item className={classes.grid}>
          <InputLabel shrink id="date">
            Date
          </InputLabel>
          <Input
            fullWidth
            inputComponent={() => (
              <DatePicker
                className={classes.datePicker}
                calendarClassName={classes.calendar}
                value={selectedDate}
                onChange={(date) => handleDateChange(date)}
              />
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
