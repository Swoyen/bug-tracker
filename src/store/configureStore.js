import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import logger from "./middleware/logger";
import toast from "./middleware/toast";
import api from "./middleware/api";
import * as actions from "./api";

const configStore = () => {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleWare) =>
      getDefaultMiddleWare({
        serializableCheck: {
          ignoredActions: [actions.apiCallWithFormDataBegan.type],
        },
      }).concat([logger({ destination: "console" }), toast, api]),
  });
};

export default configStore;
