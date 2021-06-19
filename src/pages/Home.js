import React from "react";
import { Redirect } from "react-router";

const Home = (props) => {
  const { isLoggedIn } = props;
  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }
  return <div>Home</div>;
};

export default Home;
