import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";

const statusSlice = createSlice({
  name: "statuses",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    statusRequested: (statuses, action) => {
      statuses.loading = true;
      statuses.lastFetch = Date.now();
    },

    statusReceived: (statuses, action) => {
      statuses.list = action.payload;
      statuses.loading = false;
    },

    statusRequestFailed: (statuses, action) => {
      statuses.loading = false;
    },
  },
});

export const loadStatuses = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.statuses;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // only load if not loaded in last ten minutes
  // if (diffInMinutes < 10) {
  //   return;
  // }
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.STATUS,
      onStart: statusRequested.type,
      onSuccess: statusReceived.type,
      onError: statusRequestFailed.type,
    })
  );
};

export const getAllStatuses = createSelector(
  (state) => state.entities.statuses,
  (statuses) => statuses.list
);

const { statusReceived, statusRequested, statusRequestFailed } =
  statusSlice.actions;
export default statusSlice.reducer;
