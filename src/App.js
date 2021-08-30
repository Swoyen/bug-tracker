import { BrowserRouter, Route } from "react-router-dom";
import React, { useEffect } from "react";
import {
  useIsAuthenticated,
  useMsal,
  useMsalAuthentication,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { useDispatch, useSelector } from "react-redux";

import {
  Collapse,
  createTheme as createMuiTheme,
  makeStyles,
} from "@material-ui/core";

import { ThemeProvider } from "@material-ui/styles";

import { UserProvider } from "./context/UserContext";

import Nav from "./components/Main/Nav";
import Projects from "./components/Project/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import ProjectCreate from "./components/Project/ProjectCreate/ProjectCreate";

import { loginRequest } from "./api";
import Project from "./components/Project/Project";

import PrivateRoute from "./components/Route/PrivateRoute";
import SignIn from "./components/Auth/SignIn";
import { acquireToken, signUserIn } from "./store/auth";
import ProjectSettings from "./components/Project/ProjectSettings/ProjectSettings";
import { apiRequest } from "./api/config";
import { Fade } from "@material-ui/core";

import { SnackbarProvider } from "notistack";

import Notifier from "./components/Notifier";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#145DA0",
      dark: "#0C2D48",
      light: "#B1D4E0",
    },

    secondary: {
      main: "#E8EEF1",
    },

    default: {
      main: "#FFFFFF",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    subtitle1: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
      textTransform: "uppercase",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingTop: "100px", flexGrow: 1 },
}));

const App = () => {
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useDispatch();
  const classes = useStyles();
  const shouldAcquireToken = useSelector(
    (state) => state.entities.auth.shouldAcquireToken
  );
  const { instance, accounts } = useMsal();
  const { login, error } = useMsalAuthentication(
    InteractionType.Silent,
    loginRequest
  );

  useEffect(() => {
    if (error) {
      login(InteractionType.Redirect, loginRequest).catch((err) => {
        console.log(err);
      });
    } else {
    }
  }, [error, login]);

  useEffect(() => {
    if (accounts.length > 0) {
      dispatch(signUserIn(accounts[0].idTokenClaims));
    }
  }, [accounts]);

  useEffect(() => {
    (async () => {
      if (shouldAcquireToken && instance && accounts.length > 0) {
        const request = { ...apiRequest, account: accounts[0] };
        dispatch(acquireToken({ instance, request }));
      }
    })();
  }, [instance, accounts, shouldAcquireToken]);

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Fade}
        >
          <UserProvider>
            <BrowserRouter>
              <Notifier />
              {isAuthenticated ? <Nav></Nav> : ""}
              <main className={classes.content}>
                <Route path="/login" component={() => <Login />}></Route>
                <Route path="/register" component={() => <Register />}></Route>
                <Route path="/signin" component={() => <SignIn />}></Route>
                <Route path="/" exact component={() => <Home />}></Route>
                <PrivateRoute isAuthenticated exact path="/projects">
                  <Projects />
                </PrivateRoute>
                <PrivateRoute isAuthenticated path="/projects/:id">
                  <Project />
                </PrivateRoute>
                <PrivateRoute path="/dashboard">
                  <Dashboard></Dashboard>
                </PrivateRoute>
              </main>
            </BrowserRouter>
            <ProjectCreate></ProjectCreate>
            <ProjectSettings></ProjectSettings>
          </UserProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
