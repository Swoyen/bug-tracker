import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";
import {
  addBugCheckListItem,
  completeCheckListItem,
  removeBugCheckListItem,
  uncompleteCheckListItem,
} from "./bugs";

const checkListSlice = createSlice({
  name: "checkList",
  initialState: {
    checkListItems: [],
    checkListId: null,
    progress: 0,
    loading: false,
    lastFetch: null,
  },
  reducers: {
    checkListRequested: (checkList, action) => {
      checkList.loading = true;
      checkList.lastFetch = Date.now();
    },

    checkListReceived: (checkList, action) => {
      let { checkListId, checkListItems } = action.payload;
      checkList.checkListId = checkListId;

      checkList.checkListItems = checkListItems !== null ? checkListItems : [];

      let total = checkListItems ? checkListItems.length : 0;

      var completed = 0;
      checkListItems &&
        checkListItems.forEach((item) => {
          if (item.completed) completed++;
        });
      var progress = total === 0 ? 0 : parseInt((completed / total) * 100);
      checkList.progress = progress;

      checkList.loading = false;
    },

    checkListRequestFailed: (checkList, action) => {
      checkList.loading = false;
    },

    checkListItemAdded: (checkList, action) => {
      checkList.checkListItems.push(action.payload);
      let total = checkList.checkListItems.length;
      var completed = 0;
      checkList.checkListItems.forEach((item) => {
        if (item.completed) completed++;
      });
      var progress = parseInt((completed / total) * 100);
      checkList.progress = progress;
    },

    checkListItemRemoved: (checkList, action) => {
      var newCheckList = checkList.checkListItems.filter(
        (item) => item.checkListItemId !== action.payload.checkListItemId
      );
      checkList.checkListItems = newCheckList;

      let total = newCheckList.length;
      var completed = 0;
      newCheckList.forEach((item) => {
        if (item.completed) completed++;
      });
      var progress = parseInt((completed / total) * 100);
      checkList.progress = progress;
    },

    checkListModified: (checkList, action) => {
      var newCheckList = checkList.checkListItems.map((item) =>
        item.checkListItemId !== action.payload.checkListItemId
          ? item
          : action.payload
      );
      checkList.checkListItems = newCheckList;

      let total = newCheckList.length;
      var completed = 0;
      newCheckList.forEach((item) => {
        if (item.completed) completed++;
      });
      var progress = parseInt((completed / total) * 100);
      checkList.progress = progress;
    },

    checkListUnloaded: (checkList) => {
      checkList.checkListItems = [];
      checkList.checkListId = null;
      checkList.progress = 0;
    },
  },
});

export const loadCheckList = (id) => (dispatch, getState) => {
  const { lastFetch } = getState().entities.statuses;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // only load if not loaded in last ten minutes
  // if (diffInMinutes < 10) {
  //   return;
  // }
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.CHECKLIST + "/" + id,
      onSuccess: checkListReceived.type,
    })
  );
};

export const createCheckList = (checkList) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.CHECKLIST,
      method: "post",
      data: checkList,
      onSuccess: checkListReceived.type,
    })
  );
};

export const addCheckListItem = (item, bugId) => (dispatch) => {
  dispatch(addBugCheckListItem(bugId));
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.CHECKLISTITEM,
      method: "post",
      data: item,
      onSuccess: checkListItemAdded.type,
    })
  );
};

export const removeCheckListItem = (item, bugId) => (dispatch) => {
  var id = item.checkListItemId;
  var completed = item.completed;
  dispatch(removeBugCheckListItem(bugId));
  if (completed) dispatch(uncompleteCheckListItem(bugId));
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.CHECKLISTITEM + "/" + id,
      method: "delete",
      onSuccess: checkListItemRemoved.type,
    })
  );
};

export const toggleCheckListItem = (checkListItem, bugId) => (dispatch) => {
  let newState = !checkListItem.completed;
  newState
    ? dispatch(completeCheckListItem(bugId))
    : dispatch(uncompleteCheckListItem(bugId));
  let toggledCheckListItem = {
    ...checkListItem,
    completed: newState,
  };

  let id = checkListItem.checkListItemId;
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.CHECKLISTITEM + "/" + id,
      method: "put",
      data: toggledCheckListItem,
      onSuccess: checkListModified.type,
    })
  );
};

export const modifyCheckListItem = (checkListItem) => (dispatch) => {
  let id = checkListItem.checkListItemId;
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.CHECKLISTITEM + "/" + id,
      method: "put",
      data: checkListItem,
      onSuccess: checkListModified.type,
    })
  );
};

export const unloadCheckList = () => (dispatch) => {
  return dispatch(checkListUnloaded());
};

const {
  checkListReceived,
  checkListRequested,
  checkListRequestFailed,
  checkListItemAdded,
  checkListItemRemoved,
  checkListUnloaded,
  checkListModified,
} = checkListSlice.actions;
export default checkListSlice.reducer;
