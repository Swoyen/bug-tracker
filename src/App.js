import { BrowserRouter, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { useIsAuthenticated, useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

import { createTheme as createMuiTheme, makeStyles } from "@material-ui/core";

import { ThemeProvider } from "@material-ui/styles";

import { UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext";

import Nav from "./components/Main/Nav";
import Projects from "./components/Project/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard";
import ProjectCreate from "./components/Project/ProjectCreate/ProjectCreate";

import { loginRequest } from "./api";
import Project from "./components/Project/Project";
import ProjectSettings from "./components/Project/ProjectSettings";
import PrivateRoute from "./components/Route/PrivateRoute";
import SignIn from "./components/Auth/SignIn";

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

  const classes = useStyles();

  // useEffect(() => {
  //   console.log(inProgress);
  //   if (inProgress === "none" && !isLoggedIn) {
  //     handleLogin();
  //   }
  // }, [inProgress, instance]);
  const { login, error } = useMsalAuthentication(
    InteractionType.Silent,
    loginRequest
  );
  useEffect(() => {
    if (error) {
      login(InteractionType.Redirect, loginRequest).catch((err) =>
        console.log(err)
      );
    }
  }, [error]);

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <ProjectProvider>
            <BrowserRouter>
              {/* {isLoggedIn ? <Nav></Nav> : ""} */};
              {isAuthenticated ? <Nav></Nav> : ""}
              <main className={classes.content}>
                <Route path="/login" component={() => <Login />}></Route>
                <Route path="/register" component={() => <Register />}></Route>
                <Route path="/signin" component={() => <SignIn />}></Route>
                <Route path="/" exact component={() => <Home />}></Route>
                {/* <Route path="/bugs" exact component={() => <Bug />}></Route> */}
                {/* <Route exact path="/projects" component={() => <Projects />} /> */}
                <PrivateRoute exact path="/projects">
                  <Projects />
                </PrivateRoute>
                <PrivateRoute path="/projects/:id">
                  <Project />
                </PrivateRoute>
                <PrivateRoute path="/dashboard">
                  <Dashboard></Dashboard>
                </PrivateRoute>
              </main>
            </BrowserRouter>
            <ProjectCreate></ProjectCreate>
            <ProjectSettings></ProjectSettings>
          </ProjectProvider>
        </UserProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
