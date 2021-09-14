import {
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import ProjectSettingsAccessList from "./ProjectSettingsAccessList";

const useStyles = makeStyles((theme) => ({}));

const ProjectSettingsAccess = (props) => {
  const {
    users,
    userToAdd,
    userToAddInput,
    emptyUser,
    addUsers,
    setUserToAdd,
    setUserToAddInput,
    addedUsers,
    removeAddedUser,
    authorized,
  } = props;
  const classes = useStyles();
  return authorized ? (
    <>
      <Grid
        item
        container
        xs={12}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={4}>
          <Typography variant="body1">Project Access</Typography>
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            options={users}
            value={userToAdd}
            onChange={(event, newValue) => setUserToAdd(newValue)}
            inputValue={userToAddInput}
            onInputChange={(event, newInputValue) =>
              setUserToAddInput(newInputValue)
            }
            getOptionLabel={(option) => (option ? option.userName : "")}
            getOptionSelected={(option, value) => {
              return option.userId === value.userId;
            }}
            getOptionDisabled={(option) => option === emptyUser}
            id="clear-on-escape"
            clearOnEscape
            renderInput={(params) => (
              <TextField {...params} label="Select User" margin="normal" />
            )}
          />
        </Grid>
        <Grid item>
          <IconButton onClick={() => addUsers()} size="small">
            <AddCircleRoundedIcon fontSize="medium"></AddCircleRoundedIcon>
          </IconButton>
        </Grid>
      </Grid>
      <Grid item container xs={12} justifyContent="flex-end">
        <Grid item xs={8}>
          <Grid
            item
            container
            xs={12}
            className={classes.addedUsers}
            justifyContent="flex-start"
          >
            <Grid item xs={12}>
              <ProjectSettingsAccessList
                addedUsers={addedUsers}
                removeAddedUser={removeAddedUser}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  ) : (
    <></>
  );
};

export default ProjectSettingsAccess;
