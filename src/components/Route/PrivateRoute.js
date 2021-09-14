import React from "react";
import { Redirect, Route } from "react-router";

const PrivateRoute = ({ isAuthenticated, children, ...rest }) => {
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
