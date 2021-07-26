import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { createTheme as createMuiTheme, makeStyles } from "@material-ui/core";
import { green, purple } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";

import { UserContext, UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext";

import Bug from "./components/Bug";
import Nav from "./components/Main/Nav";
import Projects from "./components/Project/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProjectSideBar from "./components/Main/ProjectSideBar";
import Dashboard from "./components/Dashboard";
import ProjectCreate from "./components/Project/ProjectCreate/ProjectCreate";

import { AUTHENTICATIONENDPOINTS, createAuthenticationEndPoint } from "./api";
import Project from "./components/Project/Project";
import ProjectSettings from "./components/Project/ProjectSettings";
import PrivateRoute from "./components/Route/PrivateRoute";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFFFFF",
    },

    secondary: {
      main: "#000000",
    },

    default: {
      main: "#2C75FF",
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const classes = useStyles();

  const routes = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/", element: <Home /> },
    { path: "/bugs", element: <Bug /> },
    { path: "/projects", element: <Projects /> },
  ];

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <UserProvider isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
          <ProjectProvider>
            <BrowserRouter>
              {/* {isLoggedIn ? <Nav></Nav> : ""} */};
              {isLoggedIn ? <Nav></Nav> : ""}
              <main className={classes.content}>
                <Route path="/login" component={() => <Login />}></Route>
                <Route path="/register" component={() => <Register />}></Route>

                <Route path="/" exact component={() => <Home />}></Route>
                {/* <Route path="/bugs" exact component={() => <Bug />}></Route> */}
                {/* <Route exact path="/projects" component={() => <Projects />} /> */}
                <PrivateRoute exact path="/projects">
                  <Projects />
                </PrivateRoute>
                <PrivateRoute path="/projects/:id">
                  <Project />
                </PrivateRoute>
                <PrivateRoute
                  path="/dashboard"
                  component={() => <Dashboard />}
                ></PrivateRoute>
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
