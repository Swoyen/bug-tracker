import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan, apiCallWithFormDataBegan } from "./api";
import { bugArrayModified, bugRemovedFromArray } from "./bugs";
import { successSnackbarEnqueued } from "./notifier";

const bugSlice = createSlice({
  name: "bug",
  initialState: {
    loadedBug: {},
    attachments: [],
    attachmentUploading: false,
    attachmentListLoading: false,
    attachmentLoading: false,
    attachmentDeleteShown: false,
    attachmentDeleteId: -1,
    modifying: false,
    loading: false,
    shown: false,
    deleteShown: false,
    resolveShown: false,
    editable: false,
    tempDesc: "",
    tempTitle: "",
    id: -1,
  },
  reducers: {
    bugRequested: (bug, action) => {
      bug.loading = true;
    },

    bugModifyRequested: (bug, action) => {
      bug.modifying = true;
    },

    bugModifyRequestFailed: (bug) => {
      bug.modifying = false;
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
      shownBug.attachments = [];
      shownBug.id = -1;
    },

    bugModified: (shownBug, action) => {
      //shownBug.loading = false;
      shownBug.loadedBug = action.payload;
      shownBug.modifying = false;
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

    bugResolveShown: (bug, action) => {
      bug.resolveShown = true;
    },
    bugResolveHidden: (bug, action) => {
      bug.resolveShown = false;
    },

    bugFileAttachStarted: (bug) => {
      bug.attachmentUploading = true;
    },

    bugFileAttachCompleted: (bug, action) => {
      bug.attachmentUploading = false;
      bug.attachments.push(action.payload);
    },

    bugFileAttachFailed: (bug) => {
      bug.attachmentUploading = false;
    },

    bugFileAttachmentRequested: (bug) => {
      bug.attachmentListLoading = true;
    },
    bugFileAttachmentReceived: (bug, action) => {
      bug.attachmentListLoading = false;
      bug.attachments = action.payload;
    },
    bugFileAttachmentFailed: (bug) => {
      bug.attachmentListLoading = false;
    },

    bugFileAttachmentRemoved: (bug, action) => {
      bug.attachments = bug.attachments.filter(
        (attachment) => attachment.attachmentId !== action.payload.attachmentId
      );
    },

    bugFileAttachmentDeleteShown: (bug, action) => {
      bug.attachmentDeleteShown = true;
      bug.attachmentDeleteId = action.payload;
    },
    bugFileAttachmentDeleteHidden: (bug) => {
      bug.attachmentDeleteShown = false;
      bug.attachmentDeleteId = -1;
    },

    bugUnloaded: (bug) => {
      bug.loadedBug = {};
      bug.attachments = [];
      bug.attachmentUploading = false;
      bug.attachmentListLoading = false;
      bug.attachmentLoading = false;
      bug.attachmentDeleteShown = false;
      bug.attachmentDeleteId = -1;
      bug.modifying = false;
      bug.loading = false;
      bug.shown = false;
      bug.deleteShown = false;
      bug.resolveShown = false;
      bug.editable = false;
      bug.tempDesc = "";
      bug.tempTitle = "";
      bug.id = -1;
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

export const modifyBug = (id, bug, hide) => (dispatch) => {
  let cleanedLabels = [];
  bug.labels.forEach((label) =>
    cleanedLabels.push({ bugId: label.bugId, labelId: label.labelId })
  );
  let cleanedBug = {
    bugId: bug.bugId,
    assigneeUserId: bug.assignee.userId,
    bugDescription: bug.bugDescription,
    bugName: bug.bugName,
    createdDate: bug.createdDate,
    reporterUserId: bug.reporter.userId,
    severityId: bug.severity.severityId,
    statusId: bug.status.statusId,
    resolved: bug.resolved,
    resolvedTime: bug.resolvedTime,
    cardOrder: bug.cardOrder,
    projectId: bug.projectId,
    headerBackgroundSet: bug.headerBackgroundSet,
    headerBackgroundImgSrc: bug.headerBackgroundImgSrc,
    labels: cleanedLabels,
    checkListId: bug.checkListId,
  };
  //console.log(cleanedBug);
  if (hide) {
    dispatch(bugHidden());
  }
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUG + "/" + id,
      data: cleanedBug,
      method: "put",
      onSuccess: [bugModified.type, bugArrayModified.type],
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
  dispatch(bugUnloaded());
};

export const setBugResolveShown = (show) => (dispatch) => {
  dispatch(show ? bugResolveShown() : bugResolveHidden());
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

export const attachFile = (fileFormData) => (dispatch) => {
  dispatch(
    apiCallWithFormDataBegan({
      url: RESTRICTEDENDPOINTS.ATTACHMENTS,
      method: "post",
      data: fileFormData,
      onStart: bugFileAttachStarted.type,
      onSuccess: [
        bugFileAttachCompleted.type,
        { type: successSnackbarEnqueued.type, payload: "File uploaded." },
      ],
      onError: bugFileAttachFailed.type,
    })
  );
};

export const loadAttachedFiles = (bugId) => (dispatch) => {
  dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.ATTACHMENTS,
      method: "get",
      filter: { bugId: bugId },
      onStart: bugFileAttachmentRequested.type,
      onSuccess: bugFileAttachmentReceived.type,
      onError: bugFileAttachmentFailed.type,
    })
  );
};

export const removeAttachment = (attachmentId) => (dispatch, getState) => {
  dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.ATTACHMENTS + "/" + attachmentId,
      method: "delete",
      onSuccess: bugFileAttachmentRemoved.type,
    })
  );
};

export const setBugAttachmentDeleteShown = (show, id) => (dispatch) => {
  show
    ? dispatch(bugFileAttachmentDeleteShown(id))
    : dispatch(bugFileAttachmentDeleteHidden());
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
  bugResolveShown,
  bugResolveHidden,
  bugFileAttachStarted,
  bugFileAttachCompleted,
  bugFileAttachFailed,
  bugFileAttachmentRequested,
  bugFileAttachmentReceived,
  bugFileAttachmentFailed,
  bugFileAttachmentRemoved,
  bugFileAttachmentDeleteShown,
  bugFileAttachmentDeleteHidden,
  bugUnloaded,
} = bugSlice.actions;
export default bugSlice.reducer;
