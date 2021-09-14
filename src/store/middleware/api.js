import axios from "axios";
import { BASE_URL } from "../../api/config";
import * as actions from "../api";
import { waitUntil, TimeoutError } from "async-wait-until";
import {
  forbidUser,
  requestToken,
  setPageNotFound,
  unauthorizeUser,
} from "../auth";

const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (
      action.type !== actions.apiCallBegan.type &&
      action.type !== actions.apiCallWithFormDataBegan.type
    )
      return next(action);

    const { url, method, data, filter, onStart, onSuccess, onError } =
      action.payload;

    next(action);
    if (
      !getState().entities.auth.accessToken &&
      !getState().entities.auth.shouldAcquireToken
    )
      dispatch(requestToken());
    const canMakeRequest = await waitUntil(
      () =>
        getState().entities.auth.accessToken !== null &&
        getState().entities.auth.shouldAcquireToken === false,
      {
        timeout: 5000,
      }
    );
    try {
      if (canMakeRequest) {
        if (onStart) dispatch({ type: onStart });

        try {
          const { accessToken } = getState().entities.auth;
          var headers = {};
          if (accessToken) {
            headers = {
              Authorization: "Bearer " + accessToken,
              withCredential: true,
              "Content-type": "application/json",
            };
          }
          //axios.defaults.headers.patch["Content-type"] = "application/json";
          const response = await axios.request({
            baseURL: BASE_URL,
            url,
            method,
            data,
            headers,
            params: { ...filter },
          });
          // General
          dispatch(actions.apiCallSuccess(response.data));
          // Specific
          // multiple onSuccess
          if (typeof onSuccess === "object") {
            for (let i = 0; i < onSuccess.length; i++) {
              if (typeof onSuccess[i] === "object")
                dispatch({
                  type: onSuccess[i].type,
                  payload: onSuccess[i].payload,
                });
              else dispatch({ type: onSuccess[i], payload: response.data });
            }
          } else if (onSuccess)
            dispatch({ type: onSuccess, payload: response.data });

          return response.data;
        } catch (error) {
          // General
          if (error && error.response) {
            if (error.response.status === 401) {
              var currentTime = new Date().getTime();
              console.log("expireTime", getState().entities.auth.expiresOn);
              console.log("currentTime", currentTime);
              if (currentTime >= getState().entities.auth.expiresOn) {
                dispatch(requestToken());
              } else {
                dispatch(unauthorizeUser());
              }
            } else if (error.response.status === 403) {
              dispatch(forbidUser());
            } else if (error.response.status === 404) {
              dispatch(setPageNotFound());
            }
          }
          dispatch(actions.apiCallFailed(error.message));

          // Specific
          if (onError) dispatch({ type: onError, payload: error.message });
          throw error;
        }
      }
    } catch (e) {
      if (e instanceof TimeoutError) {
        console.error("Cant access token due to timeout");
      } else {
        throw e;
      }
    }
  };

export default api;
