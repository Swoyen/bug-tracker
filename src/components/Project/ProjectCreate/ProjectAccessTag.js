import React from "react";

import {
  Avatar,
  Grid,
  Typography,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

const useStyles = makeStyles((theme) => ({
  root: { display: "flex" },
  avatar: {
    minWidth: "30px",
    minHeight: "30px",
    zIndex: 26,
  },
  username: {
    display: "inline",
    background: "gray",
    height: "40px",
    marginLeft: "-20px",
    paddingLeft: "25px",
    marginRight: "-20px",
    paddingRight: "25px",
    zIndex: 25,
  },
  closeButton: {
    display: "inline",
    padding: "0px",
    zIndex: 27,
    background: "gray",
    "&:hover": { background: "#616161" },
  },
  closeButtonIcon: { zIndex: 27 },
  margin: theme.spacing(1),
}));

const ProjectAccessTag = (props) => {
  const classes = useStyles();
  const { user, isRemovable = true, removeAddedUser, xs = 6, sm = 4 } = props;
  return (
    <Grid className={classes.root} item xs={xs} sm={sm}>
      <Avatar className={classes.avatar}>{user.userName.charAt(0)}</Avatar>

      <div className={classes.username}>
        <Typography
          display="initial"
          style={{ paddingTop: "10px" }}
          variant="subtitle2"
        >
          {user.userName}
        </Typography>
      </div>
      {isRemovable ? (
        <IconButton
          className={classes.closeButton}
          disableRipple
          size="small"
          aria-label="delete"
          onClick={() => removeAddedUser(user)}
        >
          <CancelRoundedIcon
            className={classes.closeButtonIcon}
            style={{ fontSize: "40px", padding: "0px" }}
          />
        </IconButton>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default ProjectAccessTag;
