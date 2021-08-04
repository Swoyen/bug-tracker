import axios from "axios";

export const BASE_URL = "https://localhost:5001/api/";

export const ENDPOINTS = {
  BUG: "Bug",
  STATUS: "Status",
  SEVERITY: "Severity",
  REGISTER: "Register",
  IMAGE: "Image",
};

export const AUTHENTICATIONENDPOINTS = {
  REGISTER: "Register",
  LOGIN: "Login",
  JWTLOGIN: "Jwtlogin",
  LOGOUT: "Logout",
};

export const RESTRICTEDENDPOINTS = {
  PROJECT: "Project",
  RECENTPROJECTS: "RecentProject",
  COMMENT: "Comment",
  LIKE: "Comment" + "/" + "Like",
  TIMER: "TimeTrack",
  BUG: "Bug",
  STATUS: "Status",
  SEVERITY: "Severity",
  REGISTER: "Register",
  IMAGE: "Image",
  USER: "User",
  CURRENTUSER: "User/Current",
};

export const createAPIEndPoint = (endPoint) => {
  let url = BASE_URL + endPoint + "/";
  return {
    fetchAll: () => axios.get(url),
    fetchById: (id) => axios.get(url + id),
    create: (newRecord) => axios.post(url, newRecord),
    update: (id, updatedRecord) => axios.put(url + id, updatedRecord),
    delete: (id) => axios.delete(url + id),
  };
};

export const createAuthenticatedEndPoint = async (
  instance,
  accounts,
  endPoint
) => {
  const request = { ...apiRequest, account: accounts[0] };
  var res = await instance.acquireTokenSilent(request);
  let url = BASE_URL + endPoint + "/";
  var accessToken = res.accessToken;
  let config = {
    headers: {
      Authorization: "Bearer " + accessToken,
      withCredentials: true,
    },
  };

  return {
    fetchAll: () => axios.get(url, config),
    fetchById: (id) => axios.get(url + id, config),
    create: (newRecord) => axios.post(url, newRecord, config),
    update: (id, updatedRecord) => axios.put(url + id, updatedRecord, config),
    delete: (id) => axios.delete(url + id, config),
  };
};

export const createRestrictedAPIEndPoint = (endPoint) => {
  let url = BASE_URL + endPoint + "/";
  let config = {
    headers: {
      withCredentials: true,
    },
  };
  return {
    fetchAll: () => axios.get(url, config),
    fetchById: (id) => axios.get(url + id, config),
    create: (newRecord) => axios.post(url, newRecord, config),
    update: (id, updatedRecord) => axios.put(url + id, updatedRecord, config),
    delete: (id) => axios.delete(url + id, config),
  };
};

export const createAuthenticationEndPoint = (endPoint) => {
  let url = BASE_URL + endPoint + "/";
  return {
    post: (user, withCredentials = false) =>
      axios.post(url, user, { withCredentials: withCredentials }),
    fetch: () => axios.get(url, { withCredentials: true }),
    postWithNoArg: () =>
      // fetch("http://localhost:5000/api/logout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      // }),
      axios.get(url, { withCredentials: true }),
  };
};

export const msalConfig = {
  auth: {
    clientId: "434b41d6-e0c7-4c89-98e0-16d1124bfe4f",
    authority:
      "https://login.microsoftonline.com/481625b8-feaf-4f2f-83c6-e1cc36399516",
    redirectUri: "http://localhost:3000",
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
