import {
  makeStyles,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { AccountCircle, Menu as MenuIcon } from "@material-ui/icons";
import Button from "../../controls/Button";
import { Link, Redirect } from "react-router-dom";
import {
  AUTHENTICATIONENDPOINTS,
  createAuthenticationEndPoint,
} from "../../api";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1, zIndex: 10002 },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
  link: { textDecoration: "none", color: "white" },
}));

const Nav = (props) => {
  const { setIsLoggedIn } = props;
  const classes = useStyles();

  const logout = async () => {
    const response = await createAuthenticationEndPoint(
      AUTHENTICATIONENDPOINTS.LOGOUT
    ).postWithNoArg();
    const status = response.status;
    if (status === 200) {
      setIsLoggedIn(false);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            BugTracker
          </Typography>
          {/* <Button variant="filled">
            <Link>Register</Link>
          </Button>
          <Button variant="filled">
            <Link to>Login</Link>
          </Button> */}
          {/* {!isLoggedIn ? (
            <>
              <Link className={classes.link} to="/register">
                <Button variant="text">Register</Button>
              </Link>
              <Link className={classes.link} to="/login">
                <Button variant="text">Login</Button>
              </Link>
            </>
          ) : ( */}
          <>
            <Link className={classes.link} to="/projects">
              <Button variant="text">Projects</Button>
            </Link>
            <IconButton>
              <AccountCircle></AccountCircle>
            </IconButton>
            <Link className={classes.link} to="/login">
              <Button onClick={() => logout()} variant="text">
                Logout
              </Button>
            </Link>
          </>
          {/* )} */}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
