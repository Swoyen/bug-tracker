import axios from "axios";
import { BASE_URL } from "../../api/config";
import * as actions from "../api";
import { waitUntil, TimeoutError } from "async-wait-until";
import { requestToken } from "../auth";

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
    if (!getState().entities.auth.accessToken) dispatch(requestToken());
    const canMakeRequest = await waitUntil(
      () => getState().entities.auth.accessToken !== null,
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
          dispatch(actions.apiCallFailed(error.message));
          // Specific
          if (onError) dispatch({ type: onError, payload: error.message });
        }
      }
    } catch (e) {
      if (e instanceof TimeoutError) {
        console.error("Cant access token due to timeout");
      } else {
        console.error(e);
      }
    }
  };

export default api;
