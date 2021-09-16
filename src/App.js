import { BrowserRouter, HashRouter, Route, Switch } from "react-router-dom";
import React, { useEffect } from "react";
import {
  useIsAuthenticated,
  useMsal,
  useMsalAuthentication,
} from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { useDispatch, useSelector } from "react-redux";

import { createTheme as createMuiTheme, makeStyles } from "@material-ui/core";

import { ThemeProvider } from "@material-ui/styles";

import { UserProvider } from "./context/UserContext";

import Nav from "./components/Main/Nav";
import Projects from "./components/Project/Projects";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import ProjectCreate from "./components/Project/ProjectCreate/ProjectCreate";

import { loginRequest } from "./api";
import Project from "./components/Project/Project";

import PrivateRoute from "./components/Route/PrivateRoute";
import { acquireToken, signUserIn } from "./store/auth";
import { apiRequest } from "./api/config";
import { Fade } from "@material-ui/core";

import { SnackbarProvider } from "notistack";

import Notifier from "./components/Notifier";
import NotFound from "./components/Main/NotFound";
import Unauthorized from "./components/Main/Unauthorized";
import RedirectHandler from "./components/Main/RedirectHandler";
import UserSettings from "./components/User/UserSettings";
import { NavProvider } from "./context/NavContext";
import Forbidden from "./components/Main/Forbidden";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#145DA0",
      dark: "#0C2D48",
      light: "#B1D4E0",
    },

    secondary: {
      main: "#E8EEF1",
      ligh: "#9bb5c2",
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
  // root: {
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  content: { paddingTop: "100px", flexGrow: 1 },
}));

const App = () => {
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useDispatch();
  const classes = useStyles();
  const shouldAcquireToken = useSelector(
    (state) => state.entities.auth.shouldAcquireToken
  );
  const acquiringToken = useSelector(
    (state) => state.entities.auth.acquringToken
  );
  const { instance, accounts } = useMsal();
  const { login, error } = useMsalAuthentication(
    InteractionType.Silent,
    loginRequest
  );

  // var redirectToUnauthorize = false;
  // useEffect(() => {
  //   if (unauthorized) redirectToUnauthorize = true;
  // }, [unauthorized]);

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
  }, [accounts, dispatch]);

  useEffect(() => {
    (async () => {
      if (
        !acquiringToken &&
        shouldAcquireToken &&
        instance &&
        accounts.length > 0
      ) {
        const request = { ...apiRequest, account: accounts[0] };
        dispatch(acquireToken({ instance, request }));
      }
    })();
  }, [instance, accounts, shouldAcquireToken, acquiringToken, dispatch]);

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={Fade}
        >
          <UserProvider>
            <NavProvider>
              <HashRouter>
                <RedirectHandler />
                <Notifier />
                {isAuthenticated ? <Nav></Nav> : ""}
                <main className={classes.content}>
                  <Switch>
                    <Route path="/login" component={() => <Login />}></Route>
                    {/* <Route
                      path="/register"
                      component={() => <Register />}
                    ></Route>
                 <Route path="/signin" component={() => <SignIn />}></Route> */}
                    <PrivateRoute isAuthenticated path="/" exact>
                      <Home />
                    </PrivateRoute>
                    <PrivateRoute isAuthenticated exact path="/projects">
                      <Projects />
                    </PrivateRoute>
                    <PrivateRoute isAuthenticated path="/projects/:id">
                      <Project />
                    </PrivateRoute>
                    <PrivateRoute isAuthenticated path="/dashboard">
                      <Dashboard></Dashboard>
                    </PrivateRoute>
                    <PrivateRoute isAuthenticated path="/usersettings">
                      <UserSettings></UserSettings>
                    </PrivateRoute>
                    <Route
                      path="/401"
                      component={() => <Unauthorized />}
                    ></Route>
                    <Route path="/403" component={() => <Forbidden />}></Route>
                    <Route path="/404" component={() => <NotFound />}></Route>
                    <Route component={NotFound}></Route>
                  </Switch>
                </main>
                <ProjectCreate></ProjectCreate>
              </HashRouter>
            </NavProvider>
          </UserProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
