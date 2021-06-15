import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Input from "../controls/Input";

import { createAuthenticationEndPoint, AUTHENTICATIONENDPOINTS } from "../api";
import Form from "../layouts/Form";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  routerlink: {
    textDecoration: "none",
    color: "#3F51B5",
    textDecorationColor: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Register = () => {
  const classes = useStyles();
  const [errors, setErrors] = useState({});
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  useEffect(() => {
    setNewUser({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
    });
    setErrors({});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    let userToRegister = {
      userName: newUser.userName,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
    };

    console.log(userToRegister);

    if (validateForm()) {
      const response = await createAuthenticationEndPoint(
        AUTHENTICATIONENDPOINTS.REGISTER
      ).post(userToRegister);

      console.log(response);
    }
  };

  const validateForm = () => {
    let temp = {};
    temp.firstName = newUser.firstName !== "" ? "" : "This field is required";
    temp.lastName = newUser.lastName !== "" ? "" : "This field is required";
    temp.userName = newUser.userName !== "" ? "" : "This field is required";
    temp.email = newUser.email !== "" ? "" : "This field is required";
    temp.password = newUser.password !== "" ? "" : "Password can't be empty";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Form className={classes.form} noValidate onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Input
                fullWidth
                label="First Name"
                name="firstName"
                variant="outlined"
                required
                value={newUser.firstName}
                onChange={(e) => handleInput(e)}
                autoFocus
                error={errors.firstName}
              ></Input>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
                required
                value={newUser.lastName}
                onChange={(e) => handleInput(e)}
                error={errors.lastName}
              ></Input>
            </Grid>
            <Grid item xs={12}>
              <Input
                fullWidth
                label="User Name"
                name="userName"
                variant="outlined"
                required
                value={newUser.userName}
                onChange={(e) => handleInput(e)}
                error={errors.userName}
              ></Input>
            </Grid>
            <Grid item xs={12}>
              <Input
                fullWidth
                label="Email Address"
                name="email"
                variant="outlined"
                required
                value={newUser.email}
                onChange={(e) => handleInput(e)}
                autoComplete="email"
                error={errors.email}
              ></Input>
            </Grid>
            <Grid item xs={12}>
              <Input
                fullWidth
                label="Password"
                name="password"
                variant="outlined"
                type="password"
                required
                value={newUser.password}
                onChange={(e) => handleInput(e)}
                error={errors.password}
              ></Input>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <RouterLink
                className={classes.routerlink}
                to="/login"
                variant="body2"
              >
                Already have an account? Sign in
              </RouterLink>
            </Grid>
          </Grid>
        </Form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Register;
