import { Button, Container, Grid, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import UserCreateFakeData from "../components/User/UserCreateFakeData";
import { UserContext } from "../context/UserContext";
import { testUnauthorize } from "../store/auth";

const Home = (props) => {
  const { currentUser } = useContext(UserContext);
  const dispatch = useDispatch();
  // if (!isLoggedIn) {
  //   return <Redirect to="/login" />;
  // }

  const handleAdd = () => {};
  return (
    <Container>
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
    </Container>
  );
};

export default Home;
