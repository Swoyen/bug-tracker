import { makeStyles, AppBar, IconButton, Toolbar } from "@material-ui/core";
import React from "react";
import { AccountCircle } from "@material-ui/icons";
import Button from "../../controls/Button";
import { Link, Redirect } from "react-router-dom";

import BugReportTwoToneIcon from "@material-ui/icons/BugReportTwoTone";
import ProjectListComposition from "../Project/ProjectListComposition";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 11,
    position: "fixed",
    display: "flex",
    flexWrap: "nowrap",
  },
  appBar: { background: theme.palette.primary.dark },
  menuButton: { marginRight: theme.spacing(2) },
  links: { flexGrow: 1 },
  link: { textDecoration: "none" },
}));

const Nav = (props) => {
  const classes = useStyles();
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogout = (instance) => {
    instance
      .logoutPopup()
      .then()
      .catch((e) => {
        console.error(e);
      });
  };
  if (!isAuthenticated) return <Redirect to="/signin"></Redirect>;

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
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
            <ProjectListComposition
              className={classes.link}
            ></ProjectListComposition>
            {/* <Link className={classes.link} to="/projects">
              <Button variant="text">Projects</Button>
            </Link> */}

            <Link className={classes.link} to="/dashboard">
              <Button color="secondary" variant="text">
                Dashboard
              </Button>
            </Link>
          </div>
          {/* <Link className={classes.link}  to="/signin"> */}
          <Button
            color="secondary"
            onClick={() => handleLogout(instance)}
            variant="text"
          >
            Logout
          </Button>
          {/* </Link>{" "} */}
          <IconButton>
            <AccountCircle></AccountCircle>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
