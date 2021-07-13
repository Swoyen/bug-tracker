import React, { useState, createContext } from "react";
import { AUTHENTICATIONENDPOINTS, createAuthenticationEndPoint } from "../api";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userName, setUserName] = useState("");
  const { isLoggedIn, setIsLoggedIn } = props;
  const login = () => {
    if (!isLoggedIn) {
      (async () => {
        try {
          const response = await createAuthenticationEndPoint(
            AUTHENTICATIONENDPOINTS.JWTLOGIN
          ).fetch();

          if (response.status === 200) {
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
      value={{ userName, setUserName, isLoggedIn, setIsLoggedIn, login }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
