import React, { useState, createContext } from "react";
import { AUTHENTICATIONENDPOINTS, createAuthenticationEndPoint } from "../api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userDetails, setUserDetails] = useState({});
  const { isLoggedIn, setIsLoggedIn } = props;

  const loginJwt = () => {
    if (!isLoggedIn) {
      (async () => {
        try {
          const response = await createAuthenticationEndPoint(
            AUTHENTICATIONENDPOINTS.JWTLOGIN
          ).fetch();

          if (response.status === 200) {
            setUserDetails(response.data);
            setIsLoggedIn(true);
          }
        } catch (err) {
          setIsLoggedIn(false);
        }
      })();
    }
  };

  const login = async (user, setError) => {
    if (!isLoggedIn) {
      try {
        let response = await createAuthenticationEndPoint(
          AUTHENTICATIONENDPOINTS.LOGIN
        ).post(user, true);

        if (response.status === 200) {
          setIsLoggedIn(true);
          setUserDetails(response.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userDetails,
        loginJwt,
        login,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
