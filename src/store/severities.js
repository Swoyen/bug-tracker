import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";

const severitiesSlice = createSlice({
  name: "severities",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    severitiesRequested: (severities, action) => {
      severities.loading = true;
      severities.lastFetch = Date.now();
    },

    severitiesReceived: (severities, action) => {
      severities.list = action.payload;
      severities.loading = false;
    },

    severitiesRequestFailed: (severities, action) => {
      severities.loading = false;
    },

    // userAdded: (users, action) => {
    //   users.push({
    //     id: ++lastId,
    //     name: action.payload.name,
    //   });
    // },
  },
});

export const loadSeverities = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.severities;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // only load if not loaded in last ten minutes
  if (diffInMinutes < 10) {
    return;
  }
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.SEVERITY,
      onSuccess: severitiesReceived.type,
    })
  );
};

export const getAllSeverities = createSelector(
  (state) => state.entities.severities,
  (severities) => severities.list
);

export const {
  severitiesReceived,
  severitiesRequested,
  severitiesRequestFailed,
} = severitiesSlice.actions;
export default severitiesSlice.reducer;
