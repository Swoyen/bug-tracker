import React, { useState, createContext } from "react";
import { AUTHENTICATIONENDPOINTS, createAuthenticationEndPoint } from "../api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userDetails, setUserDetails] = useState({});
  const { isLoggedIn, setIsLoggedIn } = props;
  const login = () => {
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
  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userDetails,
        login,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
