import React from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const RedirectHandler = () => {
  const { unauthorized, forbidden, pageNotFound } = useSelector(
    (state) => state.entities.auth
  );

  if (unauthorized) {
    return <Redirect to={{ pathname: "/401" }} />;
  } else if (pageNotFound) {
    return <Redirect to={{ pathname: "/404" }} />;
  } else if (forbidden) {
    return <Redirect to={{ pathname: "/403" }} />;
  }
  return "";
};
export default RedirectHandler;
