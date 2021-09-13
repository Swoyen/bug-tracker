import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemIcon,
  Divider,
  Collapse,
} from "@material-ui/core";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import React, { useEffect, useState } from "react";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";

const ProjectSettingsAccessListItem = ({
  user,
  createDivider,
  removeAddedUser,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(true);
  }, []);

  const handleDelete = () => {
    removeAddedUser(user);
  };
  return (
    <Collapse in={collapsed}>
      <ListItem dense>
        <ListItemIcon>
          <Avatar>
            <AccountCircleRoundedIcon fontSize="large" />
          </Avatar>
        </ListItemIcon>
        <ListItemText primary={user.userName}></ListItemText>
        <ListItemSecondaryAction>
          <IconButton size="small" aria-label="remove" onClick={handleDelete}>
            <HighlightOffRoundedIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {createDivider ? <Divider /> : ""}
    </Collapse>
  );
};

export default ProjectSettingsAccessListItem;
