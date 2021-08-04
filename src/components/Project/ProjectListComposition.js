import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import {
  BASE_URL,
  createProjectAPIEndPoint,
  createAuthenticatedEndPoint,
  RESTRICTEDENDPOINTS,
} from "../../api";
import { ProjectContext } from "../../context/ProjectContext";

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
  const { instance, accounts } = useMsal();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { url, path } = useRouteMatch();

  const [recentProjectList, setRecentProjectList] = useState([]);
  const { projectList, openProjectCreate, setOpenProjectCreate } =
    useContext(ProjectContext);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const showProjectCreate = () => {
    setOpen(false);
    setOpenProjectCreate(!openProjectCreate);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

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
      (async () => {
        if (instance !== undefined && accounts !== undefined) {
          var obj = await createAuthenticatedEndPoint(
            instance,
            accounts,
            RESTRICTEDENDPOINTS.RECENTPROJECTS
          );
          if (obj) {
            var result = obj.fetchAll();
            result
              .then((res) => {
                console.log(res.data);
                let data = res.data;
                data.sort((a, b) => b.recentOrder - a.recentOrder);
                setRecentProjectList(data);
              })
              .catch((err) => console.log(err));
          }
          // .fetchAll()
          // .then((res) => {
          //   let data = res.data;
          //   data.sort((a, b) => b.recentOrder - a.recentOrder);
          //   setRecentProjectList(data);
          // })
          // .catch((err) => console.log(err));
        }
      })();
    }
  }, [open, instance, accounts]);
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
                        to={`/projects/${menuItem.openedProjectId}`}
                        key={menuItem.openedProjectId}
                      >
                        <MenuItem onClick={handleClose}>
                          <img
                            src={`${BASE_URL}Image/${menuItem.openedProject.imageName}`}
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
                    <MenuItem onClick={() => showProjectCreate()}>
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
