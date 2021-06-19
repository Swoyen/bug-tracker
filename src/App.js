import "./App.css";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Bug from "./components/Bug";
import Nav from "./components/Main/Nav";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import React, { useState, useEffect } from "react";
import { AUTHENTICATIONENDPOINTS, createAuthenticationEndPoint } from "./api";
import SideBar from "./components/Main/SideBar";
import { makeStyles } from "@material-ui/core";
import Home from "./pages/Home";
import { UserProvider } from "./context/UserContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexGrow: 100,
    padding: theme.spacing(3),
    alignContent: "center",
    textAlign: "center",
    paddingTop: "75px",
  },
}));

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const response = await createAuthenticationEndPoint(
          AUTHENTICATIONENDPOINTS.JWTLOGIN
        ).fetch();

        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    })();
  }, []);

  return (
    <div className={classes.root}>
      <UserProvider>
        <BrowserRouter>
          {isLoggedIn ? (
            <>
              <Nav setIsLoggedIn={setIsLoggedIn}></Nav> <SideBar />
            </>
          ) : (
            ""
          )}

          <main className={classes.content}>
            <Route
              path="/login"
              component={() => <Login {...{ isLoggedIn, setIsLoggedIn }} />}
            ></Route>
            <Route path="/register" component={() => <Register />}></Route>

            {/* <Container maxWidth="md"> */}
            <Route
              path="/"
              exact
              component={() => <Home {...{ isLoggedIn }} />}
            ></Route>
            <Route
              path="/bugs"
              exact
              component={() => <Bug {...{ isLoggedIn }} />}
            ></Route>
            {/* </Container> */}
          </main>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
};

export default App;
