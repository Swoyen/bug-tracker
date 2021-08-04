import { useIsAuthenticated } from "@azure/msal-react";
import React, { useContext, useEffect } from "react";
import { Redirect, Route } from "react-router";
import { UserContext } from "../../context/UserContext";

const PrivateRoute = ({ children, ...rest }) => {
  const { isLoggedIn, loginJwt } = useContext(UserContext);

  const isAuthenticated = useIsAuthenticated();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <>
            <Redirect
              to={{ pathname: "/signin", state: { from: location } }}
            ></Redirect>
          </>
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
