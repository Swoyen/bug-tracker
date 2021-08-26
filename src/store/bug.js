import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RESTRICTEDENDPOINTS } from "../api";
import { apiCallBegan } from "./api";
import { bugArrayModified, bugRemovedFromArray, modifyBugArray } from "./bugs";

const bugSlice = createSlice({
  name: "bug",
  initialState: {
    loadedBug: {},
    loading: false,
    shown: false,
    deleteShown: false,
    editable: false,
    tempDesc: "",
    tempTitle: "",
    id: -1,
  },
  reducers: {
    bugRequested: (bug, action) => {
      bug.loading = true;
    },

    bugReceived: (bug, action) => {
      bug.loadedBug = action.payload;
      bug.loading = false;
    },

    bugRequestFailed: (bug, action) => {
      bug.loading = false;
    },

    bugShown: (shownBug, action) => {
      const { id } = action.payload;
      shownBug.shown = true;
      shownBug.id = id;
    },

    bugHidden: (shownBug) => {
      shownBug.shown = false;
      shownBug.id = -1;
    },

    bugModified: (shownBug, action) => {
      shownBug.loading = false;
      shownBug.loadedBug = action.payload;
    },

    bugRemoved: (shownBug, action) => {
      shownBug.loadedBug = {};
      shownBug.id = -1;
      shownBug.shown = false;
    },

    bugEditToggled: (shownBug) => {
      shownBug.editable = !shownBug.editable;
    },

    bugDeleteShownToggled: (bug) => {
      bug.deleteShown = !bug.deleteShown;
    },

    bugTempDescChanged: (bug, action) => {
      bug.tempDesc = action.payload;
    },
    bugTempTitleChanged: (bug, action) => {
      bug.tempTitle = action.payload;
    },
  },
});

// Action Creators
export const loadBug = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUG + "/" + id,
      onStart: bugRequested.type,
      onSuccess: bugReceived.type,
      onError: bugRequestFailed.type,
    })
  );
};

export const modifyBug = (id, bug) => (dispatch) => {
  let cleanedBug = {
    bugId: bug.bugId,
    assigneeUserId: bug.assignee.userId,
    bugDescription: bug.bugDescription,
    bugName: bug.bugName,
    createdDate: bug.createdDate,
    reporterUserId: bug.reporter.userId,
    severityId: bug.severity.severityId,
    statusId: bug.status.statusId,
  };

  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUG + "/" + id,
      data: cleanedBug,
      method: "put",
      onStart: bugRequested.type,
      onSuccess: [bugModified.type, bugArrayModified.type],
      onError: bugRequestFailed.type,
    })
  );
};

export const removeBug = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUG + "/" + id,
      method: "delete",
      onSuccess: [bugRemoved.type, bugRemovedFromArray.type],
    })
  );
};

export const showBug = (id) => (dispatch) => {
  dispatch(bugShown(id));
};

export const hideBug = () => (dispatch) => {
  dispatch(bugHidden());
};

export const toggleBugEdit = () => (dispatch) => {
  dispatch(bugEditToggled());
};

export const toggleBugDeleteShown = () => (dispatch) => {
  dispatch(bugDeleteShownToggled());
};

export const setTempDesc = (desc) => (dispatch) => {
  dispatch(bugTempDescChanged(desc));
};

export const setTempTitle = (title) => (dispatch) => {
  dispatch(bugTempTitleChanged(title));
};

// Selectors
export const getShownBug = createSelector(
  (state) => state.entities.bug,
  (bug) => {
    return bug;
  }
);

export const getToggled = createSelector(
  (state) => state.entities.bug,
  (bug) => {
    return bug.editable;
  }
);

export const getBugDeleteToggled = createSelector(
  (state) => state.entities.bug,
  (bug) => {
    return bug.deleteShown;
  }
);

export const getTempDesc = createSelector(
  (state) => state.entities.bug,
  (bug) => bug.tempDesc
);

const {
  bugRequested,
  bugReceived,
  bugRequestFailed,
  bugShown,
  bugHidden,
  bugModified,
  bugEditToggled,
  bugRemoved,
  bugDeleteShownToggled,
  bugTempDescChanged,
  bugTempTitleChanged,
} = bugSlice.actions;
export default bugSlice.reducer;
