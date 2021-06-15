import {
  makeStyles,
  AppBar,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Menu as MenuIcon } from "@material-ui/icons";
import Button from "../../controls/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
  link: { textDecoration: "none", color: "white" },
}));

const Nav = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
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

          <Link className={classes.link} to="/register">
            <Button variant="text">Register</Button>
          </Link>
          <Link className={classes.link} to="/login">
            <Button variant="text">Login</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Nav;
