import { Container, Typography } from "@material-ui/core";

import React from "react";
import { useSelector } from "react-redux";
//import { useDispatch } from "react-redux";
import UserCreateFakeData from "../components/User/UserCreateFakeData";

const Home = (props) => {
  //const dispatch = useDispatch();
  // if (!isLoggedIn) {
  //   return <Redirect to="/login" />;
  // }

  const userId = useSelector((state) => state.entities.auth.userId);

  return (
    <Container>
      {!userId ? (
        "Redirecting...."
      ) : (
        <>
          <Typography variant="h5" color="initial" align="center">
            Welcome!
          </Typography>
          <Typography
            variant="subtitle1"
            color="initial"
            align="center"
            gutterBottom
          >
            You can get started by creating a project
          </Typography>
          <UserCreateFakeData />
        </>
      )}
    </Container>
  );
};

export default Home;
