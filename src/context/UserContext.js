import React, { createContext } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [userName, setUserName] = useState("");
  return <UserContext.Provider>{props.children}</UserContext.Provider>;
};
