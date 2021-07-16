import {
  makeStyles,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { AccountCircle, Menu as MenuIcon } from "@material-ui/icons";
import Button from "../../controls/Button";
import { Link, Redirect } from "react-router-dom";
import {
  AUTHENTICATIONENDPOINTS,
  createAuthenticationEndPoint,
} from "../../api";
import { UserContext } from "../../context/UserContext";
import BugReportTwoToneIcon from "@material-ui/icons/BugReportTwoTone";
import ProjectList from "./ProjectListComposition";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 11,
    position: "fixed",
    display: "flex",
    flexWrap: "nowrap",
  },
  menuButton: { marginRight: theme.spacing(2) },
  links: { flexGrow: 1, background: "yellow" },
  link: { textDecoration: "none", background: "blue" },
}));

const Nav = (props) => {
  const { userName, setUserName, isLoggedIn, setIsLoggedIn } =
    useContext(UserContext);
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
            <BugReportTwoToneIcon />
          </IconButton>
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
          <div className={classes.links}>
            <ProjectList className={classes.link}></ProjectList>
            {/* <Link className={classes.link} to="/projects">
              <Button variant="text">Projects</Button>
            </Link> */}

            <Link className={classes.link} to="/dashboard">
              <Button variant="text">Dashboard</Button>
            </Link>
          </div>
          <Link className={classes.link} to="/login">
            <Button onClick={() => logout()} variant="text">
              Logout
            </Button>
          </Link>{" "}
          <IconButton>
            <AccountCircle></AccountCircle>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
