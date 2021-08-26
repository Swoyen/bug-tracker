import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    deleteShown: false,
    commentIdToDelete: -1,
    commentToEdit: {},
  },
  reducers: {
    commentsRequested: (comments, action) => {
      comments.loading = true;
      comments.lastFetch = Date.now();
    },

    commentsReceived: (comments, action) => {
      comments.list = action.payload;
      comments.loading = false;
    },

    commentsRequestFailed: (comments, action) => {
      comments.loading = false;
    },

    commentsAdded: (comments, action) => {
      comments.list.push(action.payload);
    },

    commentDeleteShown: (comments, action) => {
      comments.deleteShown = true;
      comments.commentIdToDelete = action.payload;
    },

    commentDeleteHidden: (comments) => {
      comments.deleteShown = false;
      comments.commentIdToDelete = -1;
    },

    commentRemoved: (comments, action) => {
      comments.list = comments.list.filter(
        (comment) => comment.commentId !== action.payload.commentId
      );
      comments.commentIdToDelete = -1;
    },

    commentLiked: (comments, action) => {
      comments.list = comments.list.map((comment) =>
        comment.commentId === action.payload.commentId
          ? action.payload
          : comment
      );
    },

    commentEditStarted: (comments, action) => {
      comments.commentToEdit = action.payload;
    },

    commentEditCanceled: (comments) => {
      comments.commentToEdit = {};
    },

    commentEdited: (comments, action) => {
      comments.list = comments.list.map((comment) =>
        comment.commentId === action.payload.commentId
          ? action.payload
          : comment
      );
    },
  },
});

// Action Creators
export const loadComments = (bugId) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.COMMENT,
      filter: { bugId },
      onStart: commentsRequested.type,
      onSuccess: commentsReceived.type,
      onError: commentsRequestFailed.type,
    })
  );
};

export const addComment = (comment) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.COMMENT,
      method: "post",
      data: comment,
      onStart: commentsRequested.type,
      onSuccess: commentsAdded.type,
      onError: commentsRequestFailed.type,
    })
  );
};

export const showCommentDelete = (id) => (dispatch) => {
  dispatch(commentDeleteShown(id));
};

export const hideCommentDelete = () => (dispatch) => {
  dispatch(commentDeleteHidden());
};

export const removeComment = (id) => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.COMMENT + "/" + id,
      method: "delete",
      onSuccess: commentRemoved.type,
    })
  );
};

export const likeComment = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.LIKE + "/" + id,
      method: "get",
      onSuccess: commentLiked.type,
    })
  );
};

export const startCommentEdit = (comment) => (dispatch) => {
  return dispatch(commentEditStarted(comment));
};

export const cancelCommentEdit = () => (dispatch) => {
  return dispatch(commentEditCanceled());
};

export const updateComment = (id, comment) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.COMMENT + "/" + id,
      data: comment,
      method: "put",
      onSuccess: commentEdited.type,
    })
  );
};

// Selector
export const getAllComments = createSelector(
  (state) => state.entities.comments,
  (comments) => comments.list
);

export const getEditingComment = createSelector(
  (state) => state.entities.comments,
  (comments) => comments.commentToEdit
);

export const getCommentDeleteShown = createSelector(
  (state) => state.entities.comments,
  (comments) => comments.deleteShown
);

export const getCommentIdToDelete = createSelector(
  (state) => state.entities.comments,
  (comments) => comments.commentIdToDelete
);

const {
  commentsRequested,
  commentsReceived,
  commentsRequestFailed,
  commentsAdded,
  commentDeleteShown,
  commentDeleteHidden,
  commentRemoved,
  commentLiked,
  commentEditStarted,
  commentEditCanceled,
  commentEdited,
} = commentsSlice.actions;
export default commentsSlice.reducer;
