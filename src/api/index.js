import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

export const ENDPOINTS = {
  BUG: "Bug",
  USER: "User",
  STATUS: "Status",
  SEVERITY: "Severity",
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
