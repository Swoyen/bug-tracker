import { indigo } from "@material-ui/core/colors";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan, apiCallWithFormDataBegan } from "./api";

const timeTrackSlice = createSlice({
  name: "timeTracks",
  initialState: {
    list: [],
    listGroupedByDate: [],
    listGroupVisible: [],
    loadedTimeTrack: {},
    startedTimeTrack: {},
    loading: false,
    timeTrackEditId: -1,
    timeTrackDeleteShown: false,
    timeTrackDeleteId: -1,
    lastFetch: null,
    timerStarted: false,
    timeTrackId: -1,
  },
  reducers: {
    timeTrackRequested: (timeTracks, action) => {
      timeTracks.loading = true;
      timeTracks.lastFetch = Date.now();
    },

    timeTracksLoaded: (timeTracks, action) => {
      const timeList = action.payload;
      timeTracks.list = timeList;

      var startedTimer = timeList.find((timer) => timer.stop === false);
      if (startedTimer) {
        timeTracks.timerStarted = true;
        timeTracks.timeTrackId = startedTimer.timeTrackId;

        timeTracks.startedTimeTrack = startedTimer;
      }

      var uniqueDates = [];
      var date = new Date();
      var tempTimeList = [];
      var map = new Map();
      timeList.forEach((timeTrack) => {
        if (timeTrack.stop) {
          date = new Date(timeTrack.startTime + "Z");
          let dateNum = date.getDate();
          let monthNum = date.getUTCMonth();
          let yearNum = date.getUTCFullYear();
          let dateObj = { date: dateNum, month: monthNum, year: yearNum };
          let dateStr = dateNum + "/" + monthNum + "/" + yearNum;
          if (
            !uniqueDates.some(
              (uniqueDate) =>
                uniqueDate.date === dateObj.date &&
                uniqueDate.month === dateObj.month &&
                uniqueDate.year === dateObj.year
            )
          ) {
            uniqueDates.push(dateObj);
            map.set(dateStr, new Set().add(timeTrack));
          } else {
            var addedTimeTracks = map.get(dateStr);
            map.set(dateStr, addedTimeTracks.add(timeTrack));
          }
        }
      });
      uniqueDates.forEach((date) => {
        let dateStr = date.date + "/" + date.month + "/" + date.year;
        var values = map.get(dateStr);
        var timeTracks = [];
        values.forEach((value) => timeTracks.push(value));
        tempTimeList.push({ date: date, timeTrack: timeTracks });
      });
      tempTimeList.reverse();
      tempTimeList = tempTimeList.sort((a, b) => {
        var ad = a.date;
        var bd = b.date;
        var date1 = new Date(ad.date, ad.month, ad.year);
        var date2 = new Date(bd.date, bd.month, bd.year);
        var t1 = date1.getTime();
        var t2 = date2.getTime();
        return t2 - t1;
      });

      var tempVis = [];
      timeTracks.listGroupVisible = tempVis;

      if (timeTracks.listGroupVisible.length === uniqueDates.length) {
        // nothing
      } else if (uniqueDates.length > timeTracks.listGroupVisible.length) {
        var diff = uniqueDates.length - timeTracks.listGroupVisible.length;
        var temp = [...timeTracks.listGroupVisible];
        for (var j = 0; j < diff; j++) {
          temp.push(false);
        }
        timeTracks.listGroupVisible = [...temp];
      }
      for (var i = 0; i < uniqueDates.length; i++) {
        tempTimeList[i] = {
          ...tempTimeList[i],
          visible: timeTracks.listGroupVisible[i],
        };
      }
      timeTracks.listGroupedByDate = [...tempTimeList];
      timeTracks.loading = false;
    },

    timeTracksAdded: (timeTracks, action) => {
      let newTimeList = action.payload;
      const timeList = [...timeTracks.list, ...newTimeList];
      var startedTimer = timeList.find((timer) => timer.stop === false);
      if (startedTimer) {
        timeTracks.timerStarted = true;
        timeTracks.timeTrackId = startedTimer.timeTrackId;

        timeTracks.startedTimeTrack = startedTimer;
      }
      timeTracks.list.push(...newTimeList);

      var uniqueDates = [];
      var date = new Date();
      var tempTimeList = [];
      var map = new Map();
      timeList.forEach((timeTrack) => {
        if (timeTrack.stop) {
          date = new Date(timeTrack.startTime + "Z");
          let dateNum = date.getDate();
          let monthNum = date.getUTCMonth();
          let yearNum = date.getUTCFullYear();
          let dateObj = { date: dateNum, month: monthNum, year: yearNum };
          let dateStr = dateNum + "/" + monthNum + "/" + yearNum;
          if (
            !uniqueDates.some(
              (uniqueDate) =>
                uniqueDate.date === dateObj.date &&
                uniqueDate.month === dateObj.month &&
                uniqueDate.year === dateObj.year
            )
          ) {
            uniqueDates.push(dateObj);
            map.set(dateStr, new Set().add(timeTrack));
          } else {
            var addedTimeTracks = map.get(dateStr);
            map.set(dateStr, addedTimeTracks.add(timeTrack));
          }
        }
      });
      uniqueDates.forEach((date) => {
        let dateStr = date.date + "/" + date.month + "/" + date.year;
        var values = map.get(dateStr);
        var timeTracks = [];
        values.forEach((value) => timeTracks.push(value));
        tempTimeList.push({ date: date, timeTrack: timeTracks });
      });
      tempTimeList.reverse();
      tempTimeList = tempTimeList.sort((a, b) => {
        var ad = a.date;
        var bd = b.date;
        var date1 = new Date(ad.date, ad.month, ad.year);
        var date2 = new Date(bd.date, bd.month, bd.year);
        var t1 = date1.getTime();
        var t2 = date2.getTime();
        return t2 - t1;
      });

      var tempVis = [];
      timeTracks.listGroupVisible = tempVis;

      if (timeTracks.listGroupVisible.length === uniqueDates.length) {
        // nothing
      } else if (uniqueDates.length > timeTracks.listGroupVisible.length) {
        var diff = uniqueDates.length - timeTracks.listGroupVisible.length;
        var temp = [...timeTracks.listGroupVisible];
        for (var j = 0; j < diff; j++) {
          temp.push(false);
        }
        timeTracks.listGroupVisible = [...temp];
      }
      for (var i = 0; i < uniqueDates.length; i++) {
        tempTimeList[i] = {
          ...tempTimeList[i],
          visible: timeTracks.listGroupVisible[i],
        };
      }
      timeTracks.listGroupedByDate = [...tempTimeList];
      timeTracks.loading = false;
    },

    timeTrackRequestFailed: (timeTracks, action) => {
      timeTracks.loading = false;
    },

    timeTrackEditShown: (timeTracks, action) => {
      timeTracks.timeTrackEditId = action.payload;
    },

    timeTrackEditHidden: (timeTracks) => {
      timeTracks.timeTrackEditId = -1;
    },

    timeTrackLoaded: (timeTracks, action) => {
      timeTracks.loadedTimeTrack = action.payload;
    },

    timeTrackModified: (timeTracks, action) => {
      let newTimeTrack = action.payload;
      let oldTimeTrack = timeTracks.list.find(
        (timeTrack) => timeTrack.timeTrackId === action.payload.timeTrackId
      );
      timeTracks.list = timeTracks.list.map((timeTrack) =>
        timeTrack.timeTrackId !== action.payload.timeTrackId
          ? timeTrack
          : newTimeTrack
      );

      var date =
        newTimeTrack.startTime.slice(-1) !== "Z"
          ? new Date(newTimeTrack.startTime + "Z")
          : new Date(newTimeTrack.startTime);
      let dateNum = date.getDate();
      let monthNum = date.getUTCMonth();
      let yearNum = date.getUTCFullYear();
      let newDateObj = { date: dateNum, month: monthNum, year: yearNum };

      if (oldTimeTrack) {
        var date2 =
          oldTimeTrack.startTime.slice(-1) !== "Z"
            ? new Date(oldTimeTrack.startTime + "Z")
            : new Date(oldTimeTrack.startTime);
        let date2Num = date2.getDate();
        let month2Num = date2.getUTCMonth();
        let year2Num = date2.getUTCFullYear();
        let oldDateObj = { date: date2Num, month: month2Num, year: year2Num };
        let oldDateIndex = timeTracks.listGroupedByDate.findIndex((d) => {
          return (
            d.date.date === oldDateObj.date &&
            d.date.month === oldDateObj.month &&
            d.date.year === oldDateObj.year
          );
        }); // remove from old group

        timeTracks.listGroupedByDate[oldDateIndex].timeTrack =
          timeTracks.listGroupedByDate[oldDateIndex].timeTrack.filter(
            (timeTrack) => timeTrack.timeTrackId !== action.payload.timeTrackId
          );
      }

      // add to new group
      // check if group exists
      let newDateIndex = timeTracks.listGroupedByDate.findIndex(
        (d) =>
          d.date.date === newDateObj.date &&
          d.date.month === newDateObj.month &&
          d.date.year === newDateObj.year
      );

      // exists
      if (newDateIndex !== -1) {
        timeTracks.listGroupedByDate[newDateIndex].timeTrack.push(newTimeTrack);
      } else {
        // Create new group
        timeTracks.listGroupedByDate.push({
          date: newDateObj,
          timeTrack: [newTimeTrack],
        });
        timeTracks.listGroupedByDate.sort((a, b) => {
          var ad = a.date;
          var bd = b.date;
          var date1 = new Date(ad.date, ad.month, ad.year);
          var date2 = new Date(bd.date, bd.month, bd.year);
          var t1 = date1.getTime();
          var t2 = date2.getTime();
          return t2 - t1;
        });
      }

      // Check empty groups and delete
      timeTracks.listGroupedByDate = timeTracks.listGroupedByDate.filter(
        (ttd) => ttd.timeTrack.length !== 0
      );
      timeTracks.timeTrackEditId = -1;
    },

    timeTrackStarted: (timeTracks, action) => {
      timeTracks.timeTrackId = action.payload.timeTrackId;
      timeTracks.timerStarted = true;
      timeTracks.startedTimeTrack = action.payload;
    },

    timeTrackStopped: (timeTracks, action) => {
      timeTracks.timeTrackId = -1;
      timeTracks.timerStarted = false;
      timeTracks.startedTimeTrack = {};
    },

    timeTrackDeleteShown: (timeTracks, action) => {
      timeTracks.timeTrackDeleteShown = true;
      timeTracks.timeTrackDeleteId = action.payload;
    },

    timeTrackDeleteHidden: (timeTracks) => {
      timeTracks.timeTrackDeleteShown = false;
      timeTracks.timeTrackDeleteId = -1;
    },

    timeTrackRemoved: (timeTracks, action) => {
      timeTracks.timeTrackDeleteShown = false;
      timeTracks.timeTrackEditId = timeTracks.timeTrackDeleteId = -1;
      var oldTimeTrack = timeTracks.list.find(
        (timeTrack) => timeTrack.timeTrackId === action.payload.timeTrackId
      );
      timeTracks.list = timeTracks.list.filter(
        (timeTrack) => timeTrack.timeTrackId !== action.payload.timeTrackId
      );

      if (oldTimeTrack) {
        var date2 =
          oldTimeTrack.startTime.slice(-1) !== "Z"
            ? new Date(oldTimeTrack.startTime + "Z")
            : new Date(oldTimeTrack.startTime);
        let date2Num = date2.getDate();
        let month2Num = date2.getUTCMonth();
        let year2Num = date2.getUTCFullYear();
        let oldDateObj = { date: date2Num, month: month2Num, year: year2Num };
        let oldDateIndex = timeTracks.listGroupedByDate.findIndex((d) => {
          return (
            d.date.date === oldDateObj.date &&
            d.date.month === oldDateObj.month &&
            d.date.year === oldDateObj.year
          );
        }); // remove from old group

        timeTracks.listGroupedByDate[oldDateIndex].timeTrack =
          timeTracks.listGroupedByDate[oldDateIndex].timeTrack.filter(
            (timeTrack) => timeTrack.timeTrackId !== action.payload.timeTrackId
          );

        timeTracks.listGroupedByDate = timeTracks.listGroupedByDate.filter(
          (ttd) => ttd.timeTrack.length !== 0
        );
      }
    },
    timeTrackEmptied: (timeTracks) => {
      timeTracks.list = [];
      timeTracks.listGroupedByDate = [];
    },
  },
});

// Action creators
export const loadTimeTracksByDate = (date) => (dispatch, getState) => {
  const { lastFetch } = getState().entities.statuses;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // only load if not loaded in last ten minutes
  // if (diffInMinutes < 10) {
  //   return;
  // }
  return dispatch(
    apiCallWithFormDataBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK,
      filter: { start: date },
      onStart: timeTrackRequested.type,
      onSuccess: timeTracksAdded.type,
      onError: timeTrackRequestFailed.type,
    })
  );
};

export const loadTimeTracks = (date) => (dispatch) => {
  return dispatch(
    apiCallWithFormDataBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK,
      filter: { start: date },
      onStart: timeTrackRequested.type,
      onSuccess: timeTracksLoaded.type,
      onError: timeTrackRequestFailed.type,
    })
  );
};

export const emptyTimeTracks = () => (dispatch) => {
  dispatch(timeTrackEmptied());
};

export const loadTimeTracksByBug = (bugId) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK,
      filter: { bugId: bugId },
      onStart: timeTrackRequested.type,
      onSuccess: timeTracksLoaded.type,
      onError: timeTrackRequestFailed.type,
    })
  );
};

export const setTimeTrackEditShown = (show, id) => (dispatch) => {
  return dispatch(show ? timeTrackEditShown(id) : timeTrackEditHidden());
};

export const setTimeTrackDeleteShown = (show, id) => (dispatch) => {
  return dispatch(show ? timeTrackDeleteShown(id) : timeTrackDeleteHidden());
};

export const loadTimeTrack = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK + "/" + id,
      onSuccess: timeTrackLoaded.type,
    })
  );
};

export const modifyTimeTrack = (id, timeTrack) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK + "/" + id,
      data: timeTrack,
      method: "put",
      onSuccess: timeTrackModified.type,
    })
  );
};

export const startTimeTrack = (timeTrack) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK,
      data: timeTrack,
      method: "post",
      onSuccess: timeTrackStarted.type,
    })
  );
};

export const stopTimeTrack = (id, timeTrack) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK + "/" + id,
      data: timeTrack,
      method: "put",
      onSuccess: [timeTrackStopped.type, timeTrackModified.type],
    })
  );
};

export const removeTimeTrack = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TIMETRACK + "/" + id,
      method: "delete",
      onSuccess: timeTrackRemoved.type,
    })
  );
};

// Selectors
export const getAllTimeTracks = createSelector(
  (state) => state.entities.timeTracks,
  (timeTracks) => timeTracks.list
);

export const getAllTimeTracksGroupedByDate = createSelector(
  (state) => state.entities.timeTracks,
  (timeTracks) => timeTracks.listGroupedByDate
);

export const getTimeTrackEditId = createSelector(
  (state) => state.entities.timeTracks,
  (timeTracks) => timeTracks.timeTrackEditId
);

export const getLoadedTimeTrack = createSelector(
  (state) => state.entities.timeTracks,
  (timeTracks) => timeTracks.loadedTimeTrack
);

export const getTimeTrackIdAndStarted = createSelector(
  (state) => state.entities.timeTracks,
  (timeTracks) => ({
    timeTrackId: timeTracks.timeTrackId,
    started: timeTracks.timerStarted,
  })
);

export const getTimeTrackDeleteIdAndShown = createSelector(
  (state) => state.entities.timeTracks,
  (timeTracks) => ({
    timeTrackId: timeTracks.timeTrackDeleteId,
    shown: timeTracks.timeTrackDeleteShown,
  })
);

export const getStartedTimeTrack = createSelector(
  (state) => state.entities.timeTracks,

  (timeTracks) => {
    return timeTracks.startedTimeTrack;
  }
);

const {
  timeTrackRequested,
  timeTracksAdded,
  timeTrackRequestFailed,
  timeTrackEditShown,
  timeTrackEditHidden,
  timeTrackLoaded,
  timeTrackModified,
  timeTrackStarted,
  timeTrackStopped,
  timeTracksLoaded,
  timeTrackDeleteShown,
  timeTrackDeleteHidden,
  timeTrackRemoved,
  timeTrackEmptied,
} = timeTrackSlice.actions;
export default timeTrackSlice.reducer;
