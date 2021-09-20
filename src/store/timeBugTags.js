import { createSlice } from "@reduxjs/toolkit";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";

const timeBugTagsSlice = createSlice({
  name: "timeBugTags",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    addedBugTag: {},
  },
  reducers: {
    timeBugTagsRequested: (timeBugTags, action) => {
      timeBugTags.loading = true;
      //timeBugTags.lastFetch = Date.now();
    },

    timeBugTagsReceived: (timeBugTags, action) => {
      let tags = action.payload;
      let newTags = [];
      tags.forEach((tag) =>
        newTags.push({
          bugTagId: tag.bugTagId,
          bugTagName: tag.bugTagName,
        })
      );
      timeBugTags.list = newTags;
      timeBugTags.loading = false;
      timeBugTags.addedBugTag = {};
    },

    timeBugTagsRequestFailed: (timeBugTags) => {
      timeBugTags.loading = false;
    },

    timeBugTagAdded: (timeBugTags, action) => {
      timeBugTags.list.push(action.payload);
      timeBugTags.addedBugTag = action.payload;
    },

    addedTimeBugTagEmptied: (timeBugTags) => {
      timeBugTags.addedBugTag = {};
    },
  },
});

export const loadTimeBugTags = () => (dispatch) => {
  // only load if not loaded in last ten minutes
  // if (diffInMinutes < 10) {
  //   return;
  // }
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TAGS,
      onStart: timeBugTagsRequested.type,
      onSuccess: timeBugTagsReceived.type,
      onError: timeBugTagsRequestFailed.type,
    })
  );
};

export const addTimeTag = (tagName) => (dispatch) => {
  const newTag = { bugTagId: 0, bugTagName: tagName };
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.TAGS,
      data: newTag,
      method: "post",
      onSuccess: timeBugTagAdded.type,
    })
  );
};

export const emptyAddedTimeBugTag = () => (dispatch) => {
  return dispatch(addedTimeBugTagEmptied());
};

const {
  timeBugTagsReceived,
  timeBugTagsRequested,
  timeBugTagsRequestFailed,
  timeBugTagAdded,
  addedTimeBugTagEmptied,
} = timeBugTagsSlice.actions;
export default timeBugTagsSlice.reducer;
