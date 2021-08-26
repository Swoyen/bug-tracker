import { createSelector, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authenticated: false,
    userId: null,
    username: null,
    accessToken: null,
    acquiringToken: false,
  },
  reducers: {
    userSignedIn: (user, action) => {
      user.authenticated = true;
      let payload = action.payload;

      // // user.accessToken = payload.accessToken;
      // user.userId = payload.idTokenClaims.oid;
      // user.username = payload.idTokenClaims.preferred_username;
      // console.log(action);
    },
    userAcquiringToken: (user, action) => {
      user.acquiringToken = true;
    },
    userAcquiredToken: (user, action) => {
      user.acquiringToken = false;
      user.accessToken = action.payload.accessToken;
    },
    userSignedOut: (user) => {
      user.authenticated = false;
      user.userId = null;
      user.username = null;
      user.accessToken = null;
    },
  },
});

export const signUserIn = (user) => (dispatch) => {
  dispatch({ type: userSignedIn.type, payload: user });
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

export const signUserOut = () => (dispatch) => {
  dispatch({ type: userSignedOut.type });
};

export const getIsAuthenticated = createSelector(
  (state) => state.entities.auth,
  (auth) => auth.authenticated
);

const { userSignedIn, userSignedOut, userAcquiringToken, userAcquiredToken } =
  authSlice.actions;
export default authSlice.reducer;
