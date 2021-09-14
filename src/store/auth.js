import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { apiCallBegan, apiCallWithFormDataBegan } from "./api";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authenticated: false,
    apiUserDetails: {},
    userId: null,
    username: null,
    shouldAcquireToken: false,
    accessToken: null,
    acquiringToken: false,
    expiresOn: 0,
    unauthorized: false,
    pageNotFound: false,
    forbidden: false,
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
      user.expiresOn = action.payload.expiresOn;
    },
    userSignedOut: (user) => {
      user.authenticated = false;
      user.userId = null;
      user.username = null;
      user.accessToken = null;
      user.shouldAcquireToken = false;
      user.apiUserDetails = {};
    },
    userUnauthorized: (user, action) => {
      user.unauthorized = action.payload;
    },

    userForbidden: (user, action) => {
      user.forbidden = true;
    },
    pageNotFound: (user, action) => {
      user.pageNotFound = action.payload;
    },
    loadedUserFromApi: (user, action) => {
      user.apiUserDetails = action.payload;
    },

    modifiedUserFromApi: (user, action) => {
      user.apiUserDetails = action.payload;
    },

    deletedUserFromApi: (user, action) => {},
  },
});

// Action creators
export const signUserIn = (user) => (dispatch) => {
  dispatch(userSignedIn(user));
  //dispatch({ type: userSignedIn.type, payload: user });
};

export const loadCurrentUserFromApi = () => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.CURRENTUSER,
      onSuccess: loadedUserFromApi.type,
    })
  );
};

export const acquireToken = (msal) => async (dispatch) => {
  dispatch(userAcquiringToken());
  try {
    msal.instance
      .acquireTokenSilent(msal.request)
      .then((response) => {
        dispatch(
          userAcquiredToken({
            accessToken: response.accessToken,
            expiresOn: response.extExpiresOn.getTime(),
          })
        );
      })
      .catch((err) => {
        console.log("Error acquring", err);
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

export const testUnauthorize = () => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.UNAUTHORIZE,
    })
  );
};

export const unauthorizeUser =
  (unauthorize = true) =>
  (dispatch) => {
    return dispatch(userUnauthorized(unauthorize));
  };

export const forbidUser = () => (dispatch) => {
  return dispatch(userForbidden());
};

export const setPageNotFound =
  (notfound = true) =>
  (dispatch) => {
    return dispatch(pageNotFound(notfound));
  };

export const modifyCurrentUser = (formData) => (dispatch) => {
  return dispatch(
    apiCallWithFormDataBegan({
      url: RESTRICTEDENDPOINTS.MODIFYCURRENTUSER,
      data: formData,
      method: "put",
      onSuccess: modifiedUserFromApi.type,
    })
  );
};

export const deleteCurrentUser = () => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: RESTRICTEDENDPOINTS.DELETECURRENTUSER,
      method: "delete",
      onSuccess: deletedUserFromApi.type,
    })
  );
};
// Selectors
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
  userUnauthorized,
  loadedUserFromApi,
  modifiedUserFromApi,
  deletedUserFromApi,
  pageNotFound,
  userForbidden,
} = authSlice.actions;
export default authSlice.reducer;
