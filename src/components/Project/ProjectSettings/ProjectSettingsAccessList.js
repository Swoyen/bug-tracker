import { List, ListItem, Paper, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";
import ProjectSettingsAccessListItem from "./ProjectSettingsAccessListItem";

const ProjectSettingsAccessList = ({ addedUsers, removeAddedUser }) => {
  const theme = useTheme();
  return (
    <Paper style={{ maxHeight: "200px", overflow: "auto" }}>
      {addedUsers.length > 0 ? (
        <List>
          {addedUsers.map((user, index) => (
            <ProjectSettingsAccessListItem
              key={user.userId}
              user={user}
              removeAddedUser={removeAddedUser}
              createDivider={index < addedUsers.length - 1}
            />
          ))}
        </List>
      ) : (
        <Typography style={{ padding: theme.spacing(1) }}>
          Select a user and click on the '+' to add user
        </Typography>
      )}
    </Paper>
  );
};

export default ProjectSettingsAccessList;
