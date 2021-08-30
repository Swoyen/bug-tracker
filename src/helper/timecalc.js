import moment from "moment";

export const getDurationFromStartAndEnd = (startTime, endTime) => {
  var start = new moment(new Date(startTime));
  var end = new moment(new Date(endTime));
  var duration = moment.duration(end.diff(start));

  var hours = parseInt(duration.asHours());
  var min = parseInt(duration.asMinutes());
  var seconds = parseInt(duration.asSeconds()) % 60;
  return `${hours} h ${min} min`;
};

export const getDurationFromArray = (startEndArray) => {
  var totalDuration = 0;
  startEndArray.forEach((startEnd) => {
    var start = new moment(new Date(startEnd.startTime));
    var end = new moment(new Date(startEnd.endTime));
    var duration = moment.duration(end.diff(start));
    totalDuration += duration;
  });

  var d = moment.duration(totalDuration);
  var hours = parseInt(d.asHours());
  var min = parseInt(d.asMinutes());

  return `${hours} h ${min} min`;
};
