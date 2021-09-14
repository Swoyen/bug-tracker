import React, { useState, createContext, useEffect } from "react";
import { createAuthenticatedEndPoint } from "../api";
import { RESTRICTEDENDPOINTS } from "../api/config";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userDetails, setUserDetails] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        setUserDetails(accounts[0]);
        const apiObj = await createAuthenticatedEndPoint(
          instance,
          accounts,
          RESTRICTEDENDPOINTS.CURRENTUSER
        );
        let result = apiObj.fetchAll();
        result
          .then((res) => {
            //console.log("status", res.status);
            setCurrentUser(res.data);
            //console.log(res.data);
          })
          .catch(async (err) => {
            console.log(err);
            if (err.response && err.response.status === 404) {
              const apiObj = await createAuthenticatedEndPoint(
                instance,
                accounts,
                "User/PostMSAL"
              );
              let r = apiObj.create();
              r.then((res) => setCurrentUser(res.data)).catch((err) =>
                console.log(err)
              );
            }
          });
      }
    })();
  }, [isAuthenticated, instance, accounts]);

  const loginJwt = (callback, failcallback) => {};

  const login = async (user, setError, cb) => {};

  return (
    <UserContext.Provider
      value={{
        // isLoggedIn,
        // setIsLoggedIn,
        userDetails,
        loginJwt,
        login,
        isAuthenticated,
        currentUser,
        setCurrentUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
