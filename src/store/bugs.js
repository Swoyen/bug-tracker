import { createSlice } from "@reduxjs/toolkit";
//import moment from "moment";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import { RESTRICTEDENDPOINTS } from "../api/config";
import bug, { modifyBug } from "./bug";
import { successSnackbarEnqueued, enqueueSuccessSnackbar } from "./notifier";

const bugsSlice = createSlice({
  name: "bugs",
  initialState: {
    list: [],
    createShown: false,
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequested: (bugs) => {
      bugs.loading = true;
      bugs.lastFetch = Date.now();
    },

    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
    },

    bugsRequestFailed: (bugs) => {
      bugs.loading = false;
    },

    bugAdded: (bugs, action) => {
      bugs.createShown = !bugs.createShown;
      bugs.list.push(action.payload);
    },

    bugCreateShownToggled: (bugs) => {
      bugs.createShown = !bugs.createShown;
    },

    bugRemovedFromArray: (bugs, action) => {
      bugs.list = bugs.list.filter((bug) => {
        return bug.bugId !== action.payload.bugId;
      });
    },

    bugArrayModified: (bugs, action) => {
      const index = bugs.list.findIndex(
        (bug) => bug.bugId === action.payload.bugId
      );
      bugs.list[index] = action.payload;
    },

    bugAssignedToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index].userId = userId;
    },

    bugResolveModified: (bugs, action) => {
      let bugId = action.payload.bugId;
      bugs.list = bugs.list.filter((bug) => bug.bugId !== bugId);
    },
  },
});

// Action Creators
// Store in Config
const url = RESTRICTEDENDPOINTS.BUG;

export const loadUnresolvedBugs = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url,
      filter: { resolved: false, projectId: id },
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestFailed.type,
    })
  );
};

export const loadResolvedBugs = (id) => (dispatch, getState) => {
  // const { accessToken } = getState().entities.auth;
  // const { lastFetch } = getState().entities.bugs;
  // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffInMinutes < 10) {
  //   return;
  // }
  return dispatch(
    apiCallBegan({
      url,
      filter: { resolved: true, projectId: id },
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestFailed.type,
    })
  );
};

export const loadBugs = () => (dispatch, getState) => {
  // const { accessToken } = getState().entities.auth;
  // const { lastFetch } = getState().entities.bugs;
  // const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // if (diffInMinutes < 10) {
  //   return;
  // }
  return dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestFailed.type,
    })
  );
};

export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: "post",
    data: bug,
    onSuccess: [
      bugAdded.type,
      { type: successSnackbarEnqueued.type, payload: "Bug Added" },
    ],
  });
export const toggleBugCreateShown = () => (dispatch) => {
  dispatch(bugCreateShownToggled());
};

export const resolveBug = (bugId, bug) => (dispatch) => {
  var currentTime = new Date().toISOString();
  var newBug = { ...bug, resolved: true, resolvedTime: currentTime };

  dispatch(bugResolveModified(newBug));
  return dispatch(modifyBug(bugId, newBug, true)).then((res) =>
    dispatch(enqueueSuccessSnackbar("Bug Resolved"))
  );
};

export const unResolveBug = (bugId, bug) => (dispatch) => {
  var newBug = { ...bug, resolved: false };
  dispatch(bugResolveModified(newBug));
  return dispatch(modifyBug(bugId, newBug, true));
};

// Memoization selector
// export const getUnresolvedBugs = createSelector(
//   (state) => state.entities.bugs,
//   (state) => state.entities.projects,
//   (bugs, projects) => bugs.list.filter((bug) => !bug.resolved)
// );

export const getAllBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) => bugs.list
);

export const getBugCreateShown = createSelector(
  (state) => state.entities.bugs,
  (bugs) => bugs.createShown
);

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((bug) => bug.userId === userId)
  );

const {
  bugAdded,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed,
  bugCreateShownToggled,
  bugResolveModified,
} = bugsSlice.actions;

export const { bugArrayModified, bugRemovedFromArray } = bugsSlice.actions;
export default bugsSlice.reducer;
