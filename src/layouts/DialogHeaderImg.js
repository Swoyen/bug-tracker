import {
  useTheme,
  IconButton,
  Popper,
  Paper,
  MenuList,
  MenuItem,
  Grow,
  Typography,
  ClickAwayListener,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import SettingsSystemDaydreamIcon from "@material-ui/icons/SettingsSystemDaydream";

const DialogHeaderImg = ({ headerImgSrc, handleUnsetImg }) => {
  const theme = useTheme();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  };

  const handleAction = (e) => {
    handleClose(e);
    handleUnsetImg();
  };

  return (
    <>
      <img
        alt="Header"
        src={headerImgSrc}
        style={{
          objectFit: "cover",
          maxHeight: 200,
          margin: -theme.spacing(1),
        }}
      />
      <IconButton
        style={{
          width: theme.spacing(5),
          height: theme.spacing(5),
          position: "absolute",
          top: "150px",
          right: "12px",
          background: theme.palette.secondary.main,
        }}
        ref={anchorRef}
        aria-haspopup="true"
        aria-label="header img"
        onClick={handleToggle}
      >
        <SettingsSystemDaydreamIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
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
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={(e) => handleAction(e)}>
                    <Typography variant="subtitle2" color="initial">
                      Remove Background
                    </Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default DialogHeaderImg;
