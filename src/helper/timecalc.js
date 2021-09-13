import { HourglassFullSharp } from "@material-ui/icons";
import moment from "moment";

export const getDurationFromStartAndEnd = (startTime, endTime) => {
  var start = new moment(new Date(startTime));
  var end = new moment(new Date(endTime));
  var duration = moment.duration(end.diff(start));

  var hours = parseInt(duration.asHours());
  var min = parseInt(duration.asMinutes()) % 60;
  var seconds = parseInt(duration.asSeconds()) % 60;
  return `${hours} h ${min} min`;
};

export const getHoursFromStartAndEnd = (startTime, endTime) => {
  var start = new moment(new Date(startTime));
  var end = new moment(new Date(endTime));
  var duration = moment.duration(end.diff(start));

  var hours = duration.asHours();
  return hours;
};

export const getDurationFromHours = (hoursFloat) => {
  var hours = parseInt(hoursFloat);
  var minutes = parseInt(hoursFloat * 60) - hours * 60;

  return `${hours} h ${minutes} min`;
};

export const getDurationFromArray = (startEndArray) => {
  var totalDuration = 0;
  startEndArray.forEach((startEnd) => {
    var s = startEnd.startTime;
    var e = startEnd.endTime;
    var startTime = s.slice(-1) !== "Z" ? s : s.slice(0, s.length - 1);
    var endTime = e.slice(-1) !== "Z" ? e : e.slice(0, e.length - 1);
    var start = new moment(new Date(startTime));
    var end = new moment(new Date(endTime));
    var duration = moment.duration(end.diff(start));
    totalDuration += duration;
  });

  var d = moment.duration(totalDuration);
  var hours = parseInt(d.asHours());
  var min = parseInt(d.asMinutes()) % 60;

  console.log("d", d);
  return `${hours} h ${min} min`;
};

export const getFormattedDateFromIsoString = (dateString) => {
  var isoDateString =
    dateString.slice(-1) === "Z" ? dateString : dateString + "Z";
  var date = new Date(isoDateString);
  return date.toLocaleDateString();
};

export const getFormattedTimeFromIsoString = (dateString) => {
  var isoDateString =
    dateString.slice(-1) === "Z" ? dateString : dateString + "Z";
  var date = new Date(isoDateString);
  return date.toLocaleTimeString();
};
