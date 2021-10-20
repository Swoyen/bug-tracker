import { Container, Typography } from "@material-ui/core";

import React from "react";
import { useSelector } from "react-redux";
//import { useDispatch } from "react-redux";
import UserCreateFakeData from "../components/User/UserCreateFakeData";

const Home = () => {
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
            color="error"
            align="center"
            gutterBottom
          >
            Unfortunately, I'm using a test server which means that the server
            is usually turned off It takes about two minutes to turn on before
            it can process requests.
          </Typography>
          <Typography variant="h6" color="error" align="center" component="div">
            Things to fix:
          </Typography>
          <Typography component="li" align="center" color="error">
            Uploading files and images in production
          </Typography>
          <Typography component="li" align="center" gutterBottom color="error">
            Generating fake data
          </Typography>
          <Typography
            variant="subtitle1"
            color="initial"
            align="center"
            gutterBottom
          >
            <Typography variant="h6" color="initial" align="center">
              Features
            </Typography>
            <Typography component="li" align="center">
              Create a project and assign users to project.
            </Typography>
            <Typography component="li" align="center">
              Create and track issues in project.
            </Typography>
            <Typography component="li" align="center" gutterBottom>
              Assign issues and check issues history
            </Typography>
            You can get started by creating a project
          </Typography>
          <UserCreateFakeData />
        </>
      )}
    </Container>
  );
};

export default Home;
