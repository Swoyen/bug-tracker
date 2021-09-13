import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan } from "./api";

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    usersRequested: (users, action) => {
      users.loading = true;
      users.lastFetch = Date.now();
    },

    usersReceived: (users, action) => {
      users.list = action.payload;
      users.loading = false;
    },

    usersRequestFailed: (users, action) => {
      users.loading = false;
    },
  },
});

export const loadUsers = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.users;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  // only load if not loaded in last ten minutes
  if (diffInMinutes < 10) {
    return;
  }
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.USER,
      onStart: usersRequested.type,
      onSuccess: usersReceived.type,
      onError: usersRequestFailed.type,
    })
  );
};

export const getAllUsers = createSelector(
  (state) => state.entities.users,
  (users) => users.list
);

export const getAssignedUsers = createSelector(
  (state) => state.entities.users,
  (state) => state.entities.auth,
  (state) => state.entities.projects.loadedProject,
  (users, auth, loadedProject) => {
    return users.list.filter((user) => {
      return (
        loadedProject.assignedUsers &&
        // auth.userId !== user.userId &&
        loadedProject.assignedUsers.some(
          (assignedUserId) => assignedUserId === user.userId
        )
      );
    });
  }
);

export const { usersReceived, usersRequested, usersRequestFailed } =
  userSlice.actions;
export default userSlice.reducer;
