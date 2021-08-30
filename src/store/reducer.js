import { combineReducers } from "redux";
import entitiesReducer from "./entities";
import notifierReducer from "./notifier";

export default combineReducers({
  entities: entitiesReducer,
  notifications: notifierReducer,
});
