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
    searchTerm: "",
    filterParam: "all",
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

    bugsUnloaded: (bugs, action) => {
      bugs.list = [];
    },

    bugsSearchTermSet: (bugs, action) => {
      bugs.searchTerm = action.payload;
    },

    bugsFilterParamSet: (bugs, action) => {
      bugs.filterParam = action.payload;
    },

    bugsCheckListItemAdded: (bugs, action) => {
      let bugId = action.payload;
      bugs.list = bugs.list.map((bug) =>
        bug.bugId !== bugId
          ? bug
          : { ...bug, totalCheckListItems: bug.totalCheckListItems + 1 }
      );
    },

    bugsCheckListItemCompleted: (bugs, action) => {
      let bugId = action.payload;
      bugs.list = bugs.list.map((bug) =>
        bug.bugId !== bugId
          ? bug
          : { ...bug, solvedCheckListItems: bug.solvedCheckListItems + 1 }
      );
    },

    bugCheckListItemUncompleted: (bugs, action) => {
      let bugId = action.payload;
      bugs.list = bugs.list.map((bug) =>
        bug.bugId !== bugId
          ? bug
          : { ...bug, solvedCheckListItems: bug.solvedCheckListItems - 1 }
      );
    },

    bugsChecksListItemRemoved: (bugs, action) => {
      let bugId = action.payload;
      bugs.list = bugs.list.map((bug) =>
        bug.bugId !== bugId
          ? bug
          : { ...bug, totalCheckListItems: bug.totalCheckListItems - 1 }
      );
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

export const UnloadBugs = () => (dispatch) => {
  return dispatch(bugsUnloaded());
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

export const setBugsSearchTerm = (term) => (dispatch) => {
  return dispatch(bugsSearchTermSet(term));
};

export const setBugsFilterParam = (param) => (dispatch) => {
  return dispatch(bugsFilterParamSet(param));
};

export const addBugCheckListItem = (bugId) => (dispatch) => {
  dispatch(bugsCheckListItemAdded(bugId));
};

export const removeBugCheckListItem = (bugId) => (dispatch) => {
  dispatch(bugsChecksListItemRemoved(bugId));
};

export const completeCheckListItem = (bugId) => (dispatch) => {
  dispatch(bugsCheckListItemCompleted(bugId));
};

export const uncompleteCheckListItem = (bugId) => (dispatch) => {
  dispatch(bugCheckListItemUncompleted(bugId));
};

// Memoization selector

export const getAllBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) => bugs.list
);

export const getFilteredBugs = createSelector(
  (state) => state.entities.bugs.list,
  (state) => state.entities.bugs.searchTerm,
  (state) => state.entities.bugs.filterParam,
  (bugs, searchTerm, filterParam) => {
    switch (filterParam) {
      case "name":
        return bugs.filter((bug) =>
          bug.bugName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "description":
        return bugs.filter((bug) =>
          bug.bugDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "status":
        return bugs.filter((bug) =>
          bug.status.statusName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "severity":
        return bugs.filter((bug) =>
          bug.severity.severityName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      case "reporter":
        return bugs.filter((bug) =>
          bug.reporter.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "assignee":
        return bugs.filter((bug) =>
          bug.assignee.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "all":
        return bugs.filter(
          (bug) =>
            bug.bugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bug.bugDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return bugs;
    }
  }
);

export const getBugCreateShown = createSelector(
  (state) => state.entities.bugs,
  (bugs) => bugs.createShown
);

export const getBugById = (bugId) =>
  createSelector(
    (state) => state.entities.bugs.list,
    (bugList) => bugList.find((bug) => bug.bugId === bugId)
  );

const {
  bugAdded,
  bugsReceived,
  bugsRequested,
  bugsRequestFailed,
  bugCreateShownToggled,
  bugResolveModified,
  bugsUnloaded,
  bugsSearchTermSet,
  bugsFilterParamSet,
  bugsCheckListItemAdded,
  bugsCheckListItemCompleted,
  bugCheckListItemUncompleted,
  bugsChecksListItemRemoved,
} = bugsSlice.actions;

export const { bugArrayModified, bugRemovedFromArray } = bugsSlice.actions;
export default bugsSlice.reducer;
