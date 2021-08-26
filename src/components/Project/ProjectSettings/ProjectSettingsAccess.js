import { Grid, IconButton, makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import ProjectAccessTag from "../ProjectCreate/ProjectAccessTag";

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
      <Grid item justifyContent="center" container xs={12}>
        <Grid item xs={4}>
          Project Access
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
        <Grid item xs={2}>
          <IconButton
            onClick={() => addUsers()}
            size="small"
            style={{ marginLeft: "25px" }}
          >
            <AddCircleRoundedIcon
              style={{ fontSize: "35" }}
            ></AddCircleRoundedIcon>
          </IconButton>
        </Grid>
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs={4}></Grid>
        <Grid item xs={8}>
          <Grid
            item
            container
            xs={12}
            className={classes.addedUsers}
            justifyContent="flex-start"
            spacing={3}
          >
            {addedUsers.map((user) => {
              return (
                <ProjectAccessTag
                  xs={12}
                  sm={6}
                  key={user.userId}
                  user={user}
                  removeAddedUser={removeAddedUser}
                ></ProjectAccessTag>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </>
  ) : (
    <></>
  );
};

export default ProjectSettingsAccess;
