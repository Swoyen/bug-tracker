import { combineReducers } from "redux";
import bugsReducer from "./bugs";
import projectsReducer from "./projects";
import usersReducer from "./users";
import authReducer from "./auth";
import bugReducer from "./bug";
import statusReducer from "./status";
import severityReducer from "./severities";
import commentsReducer from "./comments";
import boardReducer from "./board";
import timeTrackReducer from "./timeTrack";

export default combineReducers({
  bugs: bugsReducer,
  bug: bugReducer,
  projects: projectsReducer,
  auth: authReducer,
  users: usersReducer,
  statuses: statusReducer,
  severities: severityReducer,
  comments: commentsReducer,
  board: boardReducer,
  timeTracks: timeTrackReducer,
});
