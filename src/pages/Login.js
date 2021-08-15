import React, { useContext, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";

import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import Input from "../controls/Input";
import Button from "../controls/Button";
import Form from "../layouts/Form";
import { UserContext } from "../context/UserContext";

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
    marginTop: theme.spacing(1),
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
  error: {
    color: "#F50057",
  },
}));

const Login = (props) => {
  const { login } = useContext(UserContext);
  let location = useLocation();
  let history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  let { from } = location.state || { from: { pathname: "/" } };

  // useEffect(() => {
  //   // loginJwt(() => history.replace(from));
  //   loginJwt(
  //     () => history.replace(from),
  //     () => {}
  //   );
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     setEmail("");
  //     setPassword();
  //     setError(false);
  //   };
  // }, []);

  const submit = async (e) => {
    e.preventDefault();
    let user = { email: email, password: password };

    try {
      login(user, setError, () => history.replace(from));
      console.log("Here");
    } catch (err) {}
  };
  // if (isLoggedIn) {
  //   return <Redirect to="/" />;
  // }

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Typography className={classes.error} variant="body2" color="initial">
          {error ? "Email Address or Password is Invalid." : ""}
        </Typography>

        <Form className={classes.form} noValidate onSubmit={submit}>
          <Input
            fullWidth
            label="Email Address"
            name="email"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          ></Input>

          <Input
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <RouterLink to="/register" className={classes.routerlink}>
                {"Don't have an account? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>
        </Form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};
export default Login;
