import { useMsal } from "@azure/msal-react";
import { useEffect, useReducer, useState } from "react";
import { createAuthenticatedEndPoint } from "../api";

const useFetch = (endpoint) => {
  const initialState = {
    status: "idle",
    error: null,
    data: [],
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "FETCHING":
        return { ...initialState, status: "fetching" };
      case "FETCHED":
        return { ...initialState, status: "fetched", data: action.payload };
      case "FETCH_ERROR":
        return { ...initialState, status: "error", error: action.payload };
      default:
        return state;
    }
  }, initialState);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    let cancelRequest = false;
    if (!endpoint) return;

    const fetchData = async () => {
      dispatch({ type: "FETCHING" });
      const apiObj = await createAuthenticatedEndPoint(
        instance,
        accounts,
        endpoint
      );
      if (cancelRequest) return;
      let result = apiObj.fetchAll();
      result
        .then((res) => {
          if (cancelRequest) return;
          dispatch({ type: "FETCHED", payload: res.data });
        })
        .catch((error) => {
          if (cancelRequest) return;
          dispatch({ type: "FETCH_ERROR", payload: error.message });
        });
    };
    if (instance && accounts.length > 0) {
      // console.log(instance);
      fetchData();
    }

    return () => (cancelRequest = true);
  }, [endpoint]);

  return { state };
};

export default useFetch;
