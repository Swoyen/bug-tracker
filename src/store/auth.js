import { createSelector, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authenticated: false,
    userId: null,
    username: null,
    shouldAcquireToken: false,
    accessToken: null,
    acquiringToken: false,
  },
  reducers: {
    userSignedIn: (user, action) => {
      user.authenticated = true;
      user.userId = action.payload.oid;
      user.username = action.payload.preferred_username;
      user.shouldAcquireToken = true;
      // // user.accessToken = payload.accessToken;
      // user.userId = payload.idTokenClaims.oid;
      // user.username = payload.idTokenClaims.preferred_username;
      // console.log(action);
    },

    userRequestedToken: (user) => {
      user.shouldAcquireToken = true;
    },

    userAcquiringToken: (user, action) => {
      user.acquiringToken = true;
    },
    userAcquiredToken: (user, action) => {
      user.acquiringToken = false;
      user.accessToken = action.payload.accessToken;
      user.shouldAcquireToken = false;
    },
    userSignedOut: (user) => {
      user.authenticated = false;
      user.userId = null;
      user.username = null;
      user.accessToken = null;
      user.shouldAcquireToken = false;
    },
  },
});

export const signUserIn = (user) => (dispatch) => {
  console.log(user);
  dispatch(userSignedIn(user));
  //dispatch({ type: userSignedIn.type, payload: user });
};

export const acquireToken = (msal) => async (dispatch) => {
  dispatch(userAcquiringToken());
  try {
    msal.instance
      .acquireTokenSilent(msal.request)
      .then((response) =>
        dispatch(userAcquiredToken({ accessToken: response.accessToken }))
      )
      .catch((err) => {
        console.log("here", err);
        if (err.name === "InteractionRequiredAuthError") {
          return msal.instance
            .acquireTokenPopup(msal.request)
            .then((response) =>
              dispatch(userAcquiredToken({ accessToken: response.accessToken }))
            )
            .catch((err) => {
              console.log(err);
            });
        }
      });
  } catch (err) {}
  // const result = await msal.instance.acquireTokenSilent(msal.request);
  // dispatch(userAcquiredToken({ accessToken: result.accessToken }));
};

export const requestToken = () => (dispatch) => {
  dispatch(userRequestedToken());
};

export const signUserOut = () => (dispatch) => {
  dispatch({ type: userSignedOut.type });
};

export const getIsAuthenticated = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.authenticated
);

const {
  userSignedIn,
  userSignedOut,
  userAcquiringToken,
  userAcquiredToken,
  userRequestedToken,
} = authSlice.actions;
export default authSlice.reducer;
