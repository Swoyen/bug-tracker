import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";
import { DateTime } from "luxon";
import { getHoursFromStartAndEnd } from "../helper/timecalc";

const reportSlice = createSlice({
  name: "report",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    bugReport: {},
    timeTrackReport: {},
    timeTrackBugReport: {},
    timeTrackReportWeek: -1,
    bugReportWeek: -1,
  },
  reducers: {
    reportsRequested: (reports, action) => {
      reports.loading = true;
      reports.lastFetch = DateTime.now();
    },
    timeTrackReportWeekSet: (reports, action) => {
      reports.timeTrackReportWeek = action.payload;
    },
    bugReportWeekSet: (reports, action) => {
      reports.bugReportWeek = action.payload;
    },
    timeTrackRequestReceived: (reports, action) => {
      let timeTracks = action.payload;

      let labels = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      var timeTracksGroupedByDay = [0, 0, 0, 0, 0, 0, 0];

      // Monday is 0
      timeTracks.forEach((timeTrack) => {
        let startTime = timeTrack.startTime;
        let endTime = timeTrack.stopTime;
        var hours = getHoursFromStartAndEnd(startTime, endTime);
        var date = new Date(startTime + "Z");
        var dayOfWeek = (date.getDay() + 6) % 7;

        timeTracksGroupedByDay[dayOfWeek] += hours;
      });

      const data = {
        labels,
        datasets: [
          {
            label: "# of hours",
            data: timeTracksGroupedByDay,
            backgroundColor: [
              "rgba(0, 110, 230, 0.87)",
              "rgba(0, 110, 230, 0.87)",
              "rgba(0, 110, 230, 0.87)",
              "rgba(0, 110, 230, 0.87)",
              "rgba(0, 110, 230, 0.87)",
              "rgba(0, 110, 230, 0.87)",
              "rgba(0, 110, 230, 0.87)",
            ],
            borderColor: [
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0)",
            ],
            borderWidth: 1,
          },
        ],
      };
      reports.timeTrackReport = data;
    },

    timeTrackBugRequestReceived: (reports, action) => {
      let timeTracks = action.payload;
      var timeTrackBugIds = [];
      var timeTrackBugData = [];
      timeTracks.forEach((timeTrack) => {
        if (!timeTrackBugIds.some((t) => t === timeTrack.bugId)) {
          timeTrackBugIds.push(timeTrack.bugId);
        }
        var hours = getHoursFromStartAndEnd(
          timeTrack.startTime,
          timeTrack.stopTime
        );
        timeTrackBugData[timeTrackBugIds.indexOf(timeTrack.bugId)] =
          timeTrackBugData[timeTrackBugIds.indexOf(timeTrack.bugId)]
            ? timeTrackBugData[timeTrackBugIds.indexOf(timeTrack.bugId)] + hours
            : hours;
      });

      let labels = timeTrackBugIds.map((timeTrackBugId) =>
        timeTrackBugId !== null ? "Bug: " + timeTrackBugId : "Unassigned"
      );
      let backgroundColor = [];
      let prev = 1;
      labels.forEach(() => {
        var r3 = parseInt(220 / prev);
        prev++;
        backgroundColor.push(`rgba(52,60,${r3},1)`);
      });

      const data = {
        labels,
        datasets: [
          {
            label: "Hours Per Issue",
            data: timeTrackBugData,
            backgroundColor,
          },
        ],
      };
      reports.timeTrackBugReport = data;
    },

    bugRequestReceived: (reports, action) => {
      let bugs = action.payload;
      let labels = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      var bugsCreatedByDate = [0, 0, 0, 0, 0, 0, 0];
      var bugsResolvedByDate = [0, 0, 0, 0, 0, 0, 0];
      bugs.forEach((bug) => {
        var date = new Date(bug.createdDate + "Z");
        var dayOfWeek = (date.getDay() + 6) % 7;
        bugsCreatedByDate[dayOfWeek] += 1;
        if (bug.resolved) {
          var date2 = new Date(bug.resolvedTime + "Z");
          var dayOfWeek2 = (date2.getDay() + 6) % 7;
          bugsResolvedByDate[dayOfWeek2] += 1;
        }
      });

      const data = {
        labels,
        datasets: [
          {
            label: "Bugs Created",
            data: bugsCreatedByDate,
            fill: false,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgba(255, 99, 132, 0.2)",
          },
          {
            label: "Bugs Resolved",
            data: bugsResolvedByDate,
            fill: false,
            backgroundColor: "rgb(0, 255, 0)",
            borderColor: "rgba(0, 255, 3, 0.2)",
          },
        ],
      };
      console.log(bugs);
      //console.log("data", data);
      reports.bugReport = data;
    },
    reportsReceived: (reports, action) => {
      reports.list = action.payload;
      reports.loading = false;
    },

    reportsRequestFailed: (reports, action) => {
      reports.loading = false;
    },
    bugRequestUserSummaryReceived: (reports, action) => {},
  },
});

export const loadTimeTrackReport =
  (projectId, userId) => (dispatch, getState) => {
    var week = DateTime.now().weekNumber;
    dispatch(timeTrackReportWeekSet(week));
    return dispatch(
      apiCallBegan({
        url: RESTRICTEDENDPOINTS.TIMETRACK,
        filter: {
          week: week,
          projectId: projectId,
          userId: userId,
        },
        onSuccess: [
          timeTrackRequestReceived.type,
          timeTrackBugRequestReceived.type,
        ],
      })
    );
  };

export const loadTimeTrackReportPrevWeek =
  (projectId, userId) => (dispatch, getState) => {
    var week = getState().entities.report.timeTrackReportWeek - 1;
    dispatch(timeTrackReportWeekSet(week));
    return dispatch(
      apiCallBegan({
        url: RESTRICTEDENDPOINTS.TIMETRACK,
        filter: {
          week: week,
          projectId: projectId,
          userId: userId,
        },
        onSuccess: [
          timeTrackRequestReceived.type,
          timeTrackBugRequestReceived.type,
        ],
      })
    );
  };

export const loadTimeTrackReportNextWeek =
  (projectId, userId) => (dispatch, getState) => {
    var week = getState().entities.report.timeTrackReportWeek + 1;
    if (week > DateTime.now().weekNumber) return;

    dispatch(timeTrackReportWeekSet(week));
    return dispatch(
      apiCallBegan({
        url: RESTRICTEDENDPOINTS.TIMETRACK,
        filter: {
          week: week,
          projectId: projectId,
          userId: userId,
        },
        onSuccess: [
          timeTrackRequestReceived.type,
          timeTrackBugRequestReceived.type,
        ],
      })
    );
  };

export const loadBugReportFromProjectId = (projectId) => (dispatch) => {
  var week = DateTime.now().weekNumber;
  dispatch(bugReportWeekSet(week));
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUG,
      filter: { projectId, week },
      onSuccess: bugRequestReceived.type,
    })
  );
};

export const loadBugReportFromUserId = (userId) => (dispatch) => {
  //var week = DateTime.now().weekNumber;
  //dispatch(bugReportWeekSet(week));
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK,
      filter: { userId },
      onSuccess: [
        timeTrackRequestReceived.type,
        timeTrackBugRequestReceived.type,
      ],
    })
  );
};

export const loadBugReportPrevWeekFromProjectId =
  (projectId) => (dispatch, getState) => {
    var week = getState().entities.report.bugReportWeek - 1;
    dispatch(bugReportWeekSet(week));
    return dispatch(
      apiCallBegan({
        url: RESTRICTEDENDPOINTS.BUG,
        filter: { projectId, week },
        onSuccess: bugRequestReceived.type,
      })
    );
  };

export const loadBugReportNextWeekFromProjectId =
  (projectId) => (dispatch, getState) => {
    var week = getState().entities.report.bugReportWeek + 1;
    if (week > DateTime.now().weekNumber) return;
    dispatch(bugReportWeekSet(week));
    return dispatch(
      apiCallBegan({
        url: RESTRICTEDENDPOINTS.BUG,
        filter: { projectId, week },
        onSuccess: bugRequestReceived.type,
      })
    );
  };

const {
  reportsReceived,
  reportsRequested,
  reportsRequestFailed,
  timeTrackRequestReceived,
  timeTrackBugRequestReceived,
  timeTrackReportWeekSet,
  bugRequestReceived,
  bugRequestUserSummaryReceived,
  bugReportWeekSet,
} = reportSlice.actions;
export default reportSlice.reducer;
