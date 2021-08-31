import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";

const labelsSlice = createSlice({
  name: "labels",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    searchTerm: "",
  },
  reducers: {
    labelsRequested: (labels, action) => {
      labels.loading = true;
      labels.lastFetch = Date.now();
    },

    labelsReceived: (labels, action) => {
      labels.list = action.payload;
      labels.loading = false;
    },

    labelsRequestFailed: (labels, action) => {
      labels.loading = false;
    },

    labelsAdded: (labels, action) => {
      labels.list.push(action.payload);
    },

    labelsModified: (labels, action) => {
      labels.list = labels.list.map((label) =>
        label.labelId !== action.payload.labelId ? label : action.payload
      );
    },

    labelsRemoved: (labels, action) => {
      console.log(action);
      labels.list = labels.list.filter(
        (label) => label.labelId !== action.payload.labelId
      );
    },

    labelsSearchTermModified: (labels, action) => {
      labels.searchTerm = action.payload;
    },
  },
});

// Action creators
export const loadLabels = () => (dispatch, getState) => {
  // only load if not loaded in last ten minutes
  // if (diffInMinutes < 10) {
  //   return;
  // }
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.LABELS,
      onStart: labelsRequested.type,
      onSuccess: labelsReceived.type,
      onError: labelsRequestFailed.type,
    })
  );
};

export const addLabel = (label) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.LABELS,
      method: "post",
      data: label,
      onSuccess: labelsAdded.type,
    })
  );
};

export const modifyLabel = (id, label) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.LABELS + "/" + id,
      method: "put",
      data: label,
      onSuccess: labelsModified.type,
    })
  );
};

export const removeLabel = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.LABELS + "/" + id,
      method: "delete",
      onSuccess: labelsRemoved.type,
    })
  );
};

export const modifySearchTerm = (term) => (dispatch) => {
  return dispatch(labelsSearchTermModified(term));
};

// Selectors
export const getSelectedLabel = createSelector(
  (state) => state.entities.labels,
  (state) => state.entities.labels.searchTerm,
  (labels, searchTerm) =>
    labels.list.filter((label) =>
      label.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
);

export const getLabelName = (id) =>
  createSelector(
    (state) => state.entities.labels,
    (labels) => labels.list.find((label) => label.labelId === id).name
  );

const {
  labelsReceived,
  labelsRequested,
  labelsRequestFailed,
  labelsAdded,
  labelsModified,
  labelsRemoved,
  labelsSearchTermModified,
} = labelsSlice.actions;
export default labelsSlice.reducer;
