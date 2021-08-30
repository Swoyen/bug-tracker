import { createSlice } from "@reduxjs/toolkit";

const notifierSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    snackbarEnqueued: (notifier, action) => {
      let notification = action.payload;
      let key = action.payload.key;
      notifier.notifications = [{ key: key, ...notification }];
    },

    successSnackbarEnqueued: (notifier, action) => {
      let key = new Date().getTime() + Math.random();

      let notification = {
        message: action.payload,
        options: { key, variant: "success", autoHideDuration: 3000 },
      };
      notifier.notifications = [{ key: key, ...notification }];
    },
    snackbarClosed: (notifier, action) => {
      let dismissAll = action.payload.dismissAll;
      let key = action.payload.key;
      notifier.notifications = notifier.notifications.map((notification) =>
        dismissAll || notification.key === key
          ? { ...notification, dismissed: true }
          : notification
      );
    },
    snackbarRemoved: (notifier, action) => {
      notifier.notifications = notifier.notifications.filter(
        (notification) => notification.key !== action.payload.key
      );
    },
  },
});

// Action creators
export const enqueueSnackbar = (notification) => (dispatch) => {
  const key = notification.options && notification.options.key;
  return dispatch(
    snackbarEnqueued({
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    })
  );
};

export const enqueueSuccessSnackbar = (message) => (dispatch) => {
  var notification = {
    message,
    options: {
      key: new Date().getTime() + Math.random(),
      variant: "success",
      autoHideDuration: 3000,
    },
  };
  return dispatch(snackbarEnqueued(notification));
};

export const enqueueErrorSnackbar = (message) => (dispatch) => {
  var notification = {
    message,
    options: {
      key: new Date().getTime() + Math.random(),
      variant: "error",
      autoHideDuration: 3000,
    },
  };
  return dispatch(snackbarEnqueued(notification));
};

export const closeSnackbar = (key) => (dispatch) => {
  return dispatch(snackbarClosed({ dismissAll: !key, key }));
};

export const removeSnackbar = (key) => (dispatch) => {
  return dispatch(snackbarRemoved(key));
};

export const {
  successSnackbarEnqueued,
  snackbarEnqueued,
  snackbarClosed,
  snackbarRemoved,
} = notifierSlice.actions;
export default notifierSlice.reducer;
