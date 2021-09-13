import axios from "axios";
import { BASE_URL, RESTRICTEDENDPOINTS } from "./config";
import fileDownload from "js-file-download";

export const createAuthenticatedEndPoint = async (
  instance,
  accounts,
  endPoint,
  filters
) => {
  const request = { ...apiRequest, account: accounts[0] };
  var res = await instance.acquireTokenSilent(request);

  //console.log("res", res);
  let url = BASE_URL + endPoint + "/";
  var accessToken = res.accessToken;
  let config = {
    headers: {
      Authorization: "Bearer " + accessToken,
      withCredentials: true,
    },
    params: {
      ...filters,
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

export const downloadFile = (id, originalFileName, accessToken) => {
  var headers = {
    Authorization: "Bearer " + accessToken,
    withCredential: true,
    "Content-type": "application/octet-stream",
  };
  // const baseURL = "https://file.io/";
  // const url = "OvdimPepjegz";
  axios
    .request({
      baseURL: BASE_URL,
      url: RESTRICTEDENDPOINTS.DOWNLOAD + "/" + id,
      method: "get",
      headers,
      responseType: "blob",
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: "application/octet-stream" });
      fileDownload(blob, originalFileName);
      // const url = window.URL.createObjectURL(new Blob([res.data]));
      // console.log("url", url);
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", originalFileName);
      // document.body.append(link);
      // link.click();
    })
    .catch((err) => {
      console.log(err);
    });
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
