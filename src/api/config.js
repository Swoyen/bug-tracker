export const BASE_URL = "https://localhost:5001/api/";

export const RESTRICTEDENDPOINTS = {
  PROJECT: "Project",
  RECENTPROJECTS: "RecentProject",
  COMMENT: "Comment",
  LIKE: "Comment/Like",
  TIMETRACK: "TimeTrack",
  BUG: "Bug",
  STATUS: "Status",
  SEVERITY: "Severity",
  REGISTER: "Register",
  IMAGE: "Image",
  USER: "User",
  CURRENTUSER: "User/Current",
  MODIFYCURRENTUSER: "User/Current/Modify",
  DELETECURRENTUSER: "User/Current/Delete",
  TAGS: "BugTag",
  LABELS: "Labels",
  ATTACHMENTS: "Attachments",
  DOWNLOAD: "Download",
  CHECKLIST: "CheckList",
  CHECKLISTITEM: "CheckListItem",
  BUGACTION: "BugAction",
  UNAUTHORIZE: "User/Unauthorize",
  GENERATEDATA: "User/Current/GenerateData",
};

var redirectUri;
if (process.env.NODE_ENV === "production") {
  console.log("Production");
  redirectUri = "http://bugissuetracker.netlify.app";
} else if (process.env.NODE_ENV === "development") {
  console.log("Development");
  redirectUri = "http://localhost:3000";
}
export const msalConfig = {
  auth: {
    clientId: "434b41d6-e0c7-4c89-98e0-16d1124bfe4f",
    authority: "https://login.microsoftonline.com/common",
    // authority:
    //   "https://login.microsoftonline.com/481625b8-feaf-4f2f-83c6-e1cc36399516",
    redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const apiRequest = {
  scopes: ["api://668714ad-ecbc-4ea8-a6bc-973e950484d7/access_as_user"],
};

export const loginRequest = {
  scopes: ["User.Read"],
};
