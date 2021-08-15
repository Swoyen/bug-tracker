import React, { useState, createContext, useEffect } from "react";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../api";
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
            setCurrentUser(res.data);
            //console.log(res.data);
          })
          .catch((err) => console.log(err));
      }
    })();
  }, [isAuthenticated, instance, accounts]);

  const loginJwt = (callback, failcallback) => {
    // if (!isLoggedIn) {
    //   (async () => {
    //     try {
    //       const response = await createAuthenticationEndPoint(
    //         AUTHENTICATIONENDPOINTS.JWTLOGIN
    //       ).fetch();
    //       if (response.status === 200) {
    //         setUserDetails(response.data);
    //         setIsLoggedIn(true);
    //         callback();
    //         return true;
    //       }
    //     } catch (err) {
    //       setIsLoggedIn(false);
    //       failcallback();
    //       return false;
    //     }
    //   })();
    // }
  };

  const login = async (user, setError, cb) => {
    // if (!isLoggedIn) {
    //   try {
    //     let response = await createAuthenticationEndPoint(
    //       AUTHENTICATIONENDPOINTS.LOGIN
    //     ).post(user, true);
    //     if (response.status === 200) {
    //       setIsLoggedIn(true);
    //       setUserDetails(response.data);
    //       setError(false);
    //       cb();
    //     } else {
    //       setError(true);
    //     }
    //   } catch (err) {
    //     setError(true);
    //   }
    // }
  };

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
