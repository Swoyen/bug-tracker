import { makeStyles, TextField } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({ textField: {} }));

const TimePicker = (props) => {
  const classes = useStyles();
  const { label, time, otherTime, isStart, timeObj, setTimeObj, ...rest } =
    props;

  const handleTimeChange = (e) => {
    // let tempDate = time;
    let value = e.target.value;
    let hhmmss = value.length === 5 ? value + ":00" : value;
    //console.log("hhmmss", hhmmss);
    var hour = parseInt(hhmmss.substring(0, hhmmss.indexOf(":")));
    var minute = parseInt(hhmmss.substring(3, hhmmss.indexOf(":", 3)));
    var second = parseInt(hhmmss.substring(6));
    // console.log("hms", hour, minute, second);
    // console.log("\n");

    setTimeObj((timeObj) => {
      return { ...timeObj, hours: hour, minutes: minute, seconds: second };
    });
  };
  const [timeValue, setTimeValue] = useState("00:00");

  useEffect(() => {
    if (timeObj) {
      var hour = timeObj.hours + "";
      if (hour.length === 1) hour = "0" + hour;
      var minute = timeObj.minutes + "";
      if (minute.length === 1) minute = "0" + minute;
      var second = timeObj.seconds + "";
      if (second.length === 1) second = "0" + second;
      setTimeValue(`${hour}:${minute}:${second}`);
      //console.log(timeObj);
    }
  }, [timeObj]);

  return (
    <TextField
      {...rest}
      id="time"
      label={label}
      type="time"
      value={timeValue}
      onChange={(e) => handleTimeChange(e)}
      className={classes.textField}
      InputLabelProps={{
        shrink: true,
      }}
      inputProps={{
        step: 1,
      }}
    />
  );
};

export default TimePicker;
