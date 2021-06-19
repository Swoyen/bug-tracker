import React, { useContext } from "react";
import { Redirect } from "react-router";
import { UserContext } from "../context/BugContext";

const Home = (props) => {
  const [userName, setUserName] = useContext(UserContext);

  const { isLoggedIn } = props;
  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }
  return <div>Hello {userName}</div>;
};

export default Home;
