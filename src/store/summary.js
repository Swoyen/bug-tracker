import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";

const summarySlice = createSlice({
  name: "summary",
  initialState: {
    list: [],
    loading: false,
    moreLoading: false,
    lastFetch: null,
    pageNumber: 1,
    pageSize: 10,
    statusCount: [],
    severityCount: [],
  },
  reducers: {
    summaryRequested: (summary, action) => {
      summary.loading = true;
      summary.lastFetch = Date.now();
    },

    summaryReceived: (summary, action) => {
      summary.list = action.payload.data;
      summary.loading = false;
      summary.pageNumber = 2;
    },

    moreSummaryRequested: (summary, action) => {
      summary.moreLoading = true;
    },

    moreSummaryReceived: (summary, action) => {
      summary.list = [...summary.list, ...action.payload.data];
      summary.pageNumber += 1;
      summary.moreLoading = false;
    },

    summaryRequestFailed: (summary, action) => {
      summary.loading = false;
      summary.moreLoading = false;
    },

    statusBugsLoaded: (summary, action) => {
      let temp = [];
      let bugs = action.payload;
      bugs.forEach((bug) => {
        if (
          temp.length > 0 &&
          temp.some((t) => t.statusId === bug.status.statusId)
        ) {
          var index = temp.findIndex((t) => t.statusId === bug.status.statusId);
          temp[index].count = temp[index].count + 1;
        } else {
          temp.push({ statusId: bug.status.statusId, count: 1 });
        }
      });
      summary.statusCount = temp;
    },

    severityBugsLoaded: (summary, action) => {
      let temp = [];
      let bugs = action.payload;
      bugs.forEach((bug) => {
        if (
          temp.length > 0 &&
          temp.some((t) => t.severityId === bug.severity.severityId)
        ) {
          var index = temp.findIndex(
            (t) => t.severityId === bug.severity.severityId
          );
          temp[index].count = temp[index].count + 1;
        } else {
          temp.push({ severityId: bug.severity.severityId, count: 1 });
        }
      });
      summary.severityCount = temp;
    },

    summaryUnloaded: (summary, action) => {
      summary.list = [];
      summary.loading = false;
      summary.moreLoading = false;
      summary.lastFetch = null;
      summary.pageNumber = 1;
      summary.pageSize = 10;
      summary.statusCount = [];
      summary.severityCount = [];
    },
  },
});

export const loadSummaryFromProjectId = (projectId) => (dispatch, getState) => {
  // only load if not loaded in last ten minutes
  // if (diffInMinutes < 10) {
  //   return;
  // }
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUGACTION,
      method: "get",
      filter: { projectId },
      onSuccess: summaryReceived.type,
    })
  );
};

export const loadSummaryFromUserId = (userId) => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUGACTION,
      method: "get",
      filter: { userId },
      onSuccess: summaryReceived.type,
    })
  );
};

export const loadMoreSummaryFromProjectId =
  (projectId) => (dispatch, getState) => {
    const { pageNumber, pageSize } = getState().entities.summary;
    return dispatch(
      apiCallBegan({
        url: RESTRICTEDENDPOINTS.BUGACTION,
        method: "get",
        filter: { projectId, pageNumber, pageSize },
        onStart: moreSummaryRequested.type,
        onSuccess: moreSummaryReceived.type,
        onError: summaryRequestFailed.type,
      })
    );
  };
export const loadMoreSummaryFromUserId = (userId) => (dispatch, getState) => {
  const { pageNumber, pageSize } = getState().entities.summary;
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUGACTION,
      method: "get",
      filter: { userId, pageNumber, pageSize },
      onStart: moreSummaryRequested.type,
      onSuccess: moreSummaryReceived.type,
      onError: summaryRequestFailed.type,
    })
  );
};

export const loadStatusCount = (projectId) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUG,
      filter: { resolved: false, projectId },
      onSuccess: statusBugsLoaded.type,
    })
  );
};

export const loadSeverityCount = (projectId) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.BUG,
      filter: { resolved: false, projectId },
      onSuccess: severityBugsLoaded.type,
    })
  );
};

export const unloadSummary = () => (dispatch) => {
  dispatch(summaryUnloaded());
};

// Selectors
export const getTotalStatus = (statusId) =>
  createSelector(
    (state) => state.entities.summary.statusCount,
    (summaryCount) => {
      return (
        statusId &&
        summaryCount.length > 0 &&
        summaryCount.find((sc) => sc.statusId === statusId) &&
        summaryCount.find((sc) => sc.statusId === statusId).count
      );
    }
  );

export const getTotalSeverity = (severityId) =>
  createSelector(
    (state) => state.entities.summary.severityCount,
    (severityCount) => {
      return (
        severityId &&
        severityCount.length > 0 &&
        severityCount.find((sc) => sc.severityId === severityId) &&
        severityCount.find((sc) => sc.severityId === severityId).count
      );
    }
  );

const {
  summaryReceived,
  //summaryRequested,
  summaryRequestFailed,
  moreSummaryReceived,
  moreSummaryRequested,
  statusBugsLoaded,
  severityBugsLoaded,
  summaryUnloaded,
} = summarySlice.actions;
export default summarySlice.reducer;
