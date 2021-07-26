import React, { useContext, useEffect } from "react";
import { Redirect, Route } from "react-router";
import { UserContext } from "../../context/UserContext";

const PrivateRoute = ({ children, ...rest }) => {
  const { isLoggedIn, loginJwt } = useContext(UserContext);
  useEffect(() => {
    loginJwt(
      () => {},
      () => {}
    );
  }, []);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <>
            <Redirect
              to={{ pathname: "/login", state: { from: location } }}
            ></Redirect>
          </>
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
