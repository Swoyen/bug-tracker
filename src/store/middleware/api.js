import axios from "axios";
import { BASE_URL } from "../../api/config";
import * as actions from "../api";

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
    const { accessToken } = getState().entities.auth;

    if (onStart) dispatch({ type: onStart });
    next(action);

    try {
      var headers = {};
      if (accessToken) {
        headers = {
          Authorization: "Bearer " + accessToken,
          withCredential: true,
        };
      }

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
          dispatch({ type: onSuccess[i], payload: response.data });
        }
      } else if (onSuccess)
        dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      // General
      dispatch(actions.apiCallFailed(error.message));
      // Specific
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };

export default api;
