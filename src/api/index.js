import axios from "axios";

export const BASE_URL = "http://localhost:5000/api/";

export const ENDPOINTS = {
  BUG: "Bug",
  USER: "User",
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

export const createRestrictedAPIEndPoint = (endPoint) => {
  let url = BASE_URL + endPoint + "/";
  return {
    fetchAll: () => axios.get(url, { withCredentials: true }),
    fetchById: (id) => axios.get(url + id, { withCredentials: true }),
    create: (newRecord) =>
      axios.post(url, newRecord, { withCredentials: true }),
    update: (id, updatedRecord) =>
      axios.put(url + id, updatedRecord, { withCredentials: true }),
    delete: (id) => axios.delete(url + id, { withCredentials: true }),
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
