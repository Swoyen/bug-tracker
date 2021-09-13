import { useMsal } from "@azure/msal-react";
import {
  ClickAwayListener,
  Grow,
  IconButton,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

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

export const UserSettingsMenu = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { instance } = useMsal();

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
    }
  }, [open]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };
  const handleLogout = (instance) => {
    instance
      .logoutPopup()
      .then(() => console.log("Do logout stuff"))
      .catch((e) => {
        console.error(e);
      });
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  return (
    <div>
      <IconButton
        color="secondary"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <AccountCircle color="secondary" />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="top-end"
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
                  <Link className={classes.link} to="/usersettings">
                    <MenuItem onClick={handleClose}>
                      <Typography variant="subtitle2" color="initial">
                        Settings
                      </Typography>
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={() => handleLogout(instance)}>
                    <Typography variant="subtitle2" color="initial">
                      Logout
                    </Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
