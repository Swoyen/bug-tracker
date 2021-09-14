import { makeStyles, AppBar, IconButton, Toolbar } from "@material-ui/core";
import React, { useContext } from "react";
import Button from "../../controls/Button";
import { Link, Redirect } from "react-router-dom";

import BugReportTwoToneIcon from "@material-ui/icons/BugReportTwoTone";
import ProjectListComposition from "../Project/ProjectListComposition";
import { useIsAuthenticated } from "@azure/msal-react";
import { UserSettingsMenu } from "../User/UserSettingsMenu";
import MenuIcon from "@material-ui/icons/Menu";
import { NavContext } from "../../context/NavContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 11,
    position: "fixed",
    display: "flex",
    flexWrap: "nowrap",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  appBar: { background: theme.palette.primary.dark },
  brandButton: { marginRight: theme.spacing(2) },
  links: { flexGrow: 1 },
  link: { textDecoration: "none", color: "inherit" },
}));

const Nav = () => {
  const classes = useStyles();
  const isAuthenticated = useIsAuthenticated();

  const [mobileOpen, setMobileOpen] = useContext(NavContext);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!isAuthenticated) return <Redirect to="/signin"></Redirect>;

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            edge="start"
            className={classes.brandButton}
            color="inherit"
            aria-label="menu"
          >
            <Link className={classes.link} to="/">
              <BugReportTwoToneIcon />
            </Link>
          </IconButton>
          <div className={classes.links}>
            <ProjectListComposition
              className={classes.link}
            ></ProjectListComposition>

            <Link className={classes.link} to="/dashboard">
              <Button color="secondary" variant="text">
                Dashboard
              </Button>
            </Link>
          </div>
          <UserSettingsMenu />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
