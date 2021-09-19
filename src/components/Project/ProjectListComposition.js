import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { Avatar, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import { BASE_URL, IMAGE_URL } from "../../api/config";
import { useDispatch, useSelector } from "react-redux";
import {
  getRecentProjects,
  loadRecentProjects,
  setProjectCreateShown,
} from "../../store/projects";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-block",
    minWidth: "100px",
    textAlign: "center",
  },
  link: {
    color: "black",
    textDecorationColor: "none",
    textDecoration: "none",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  menuItems: {
    minWidth: "200px",
    textAlign: "center",
  },
}));

const ProjectListComposition = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const recentProjectList = useSelector(getRecentProjects);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (open) {
      dispatch(loadRecentProjects());
    }
  }, [open, dispatch]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleShowProjectCreate = () => {
    setOpen(false);
    dispatch(setProjectCreateShown(true));
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={classes.root}>
      <div>
        <Button
          color="secondary"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          Projects
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="top-start"
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center top",
              }}
            >
              <Paper className={classes.menuItems}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem disabled>
                      <Typography variant="subtitle2">Recent</Typography>
                    </MenuItem>
                    {recentProjectList.map((menuItem) => (
                      <Link
                        className={classes.link}
                        to={`/projects/${menuItem.openedProjectId}/summary`}
                        key={menuItem.openedProjectId}
                      >
                        <MenuItem onClick={handleClose}>
                          <Avatar
                            src={`${IMAGE_URL}${menuItem.openedProject.imageName}`}
                            alt=""
                            style={{
                              width: "2em",
                              height: "2em",
                              marginRight: ".5em",
                              borderRadius: "50%",
                            }}
                          />

                          <Typography variant="subtitle2">
                            {menuItem.openedProject.title}
                          </Typography>
                        </MenuItem>
                      </Link>
                    ))}
                    <Divider></Divider>
                    <Link className={classes.link} to="/projects">
                      <MenuItem onClick={handleClose}>
                        <Typography variant="subtitle2">
                          All Projects
                        </Typography>
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={handleShowProjectCreate}>
                      <Typography variant="subtitle2">
                        Create Project
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
};

export default ProjectListComposition;
