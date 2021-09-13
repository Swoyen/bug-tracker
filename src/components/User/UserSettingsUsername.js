import { Grid, IconButton, TextField, Typography } from "@material-ui/core";
import { EditRounded } from "@material-ui/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import { modifyCurrentUser } from "../../store/auth";
import { useDispatch } from "react-redux";
import { useTheme } from "@material-ui/styles";
const UserSettingsUsername = () => {
  const currentUser = useSelector(
    (state) => state.entities.auth.apiUserDetails
  );
  const dispatch = useDispatch();
  const theme = useTheme();

  const [editingUsername, setEditingUsername] = useState(false);
  const [error, setError] = useState(false);
  const [usernameText, setUsernameText] = useState("");

  const handleUsernameEditToggle = () => {
    if (!editingUsername) {
      setUsernameText(currentUser.userName);
      setEditingUsername(!editingUsername);
    } else {
      if (usernameText !== currentUser.userName) {
        var formData = new FormData();
        formData.append("userId", currentUser.userId);
        formData.append("email", currentUser.email);
        formData.append("fullName", currentUser.fullName);
        formData.append("userName", usernameText);

        dispatch(modifyCurrentUser(formData))
          .then((res) => {
            if (res) {
              setEditingUsername(!editingUsername);
              setUsernameText("");
              setError(false);
            }
          })
          .catch((err) => setError(true));
      } else {
        setUsernameText("");
        setEditingUsername(!editingUsername);
        setError(false);
      }
    }
  };

  return (
    <Grid container item xs={12} alignItems="center">
      <Grid item xs={3}>
        <Typography variant="body1">Username</Typography>
      </Grid>
      <Grid item xs={9} container alignItems="center">
        <Grid item xs={6}>
          {editingUsername ? (
            <TextField
              margin="dense"
              variant="outlined"
              id="username"
              label="Set username"
              value={usernameText}
              onChange={(e) => setUsernameText(e.target.value)}
            />
          ) : (
            <Typography variant="subtitle1">{currentUser.userName}</Typography>
          )}
        </Grid>
        <Grid item>
          <IconButton
            style={{ marginLeft: theme.spacing(1) }}
            onClick={handleUsernameEditToggle}
          >
            {editingUsername ? (
              <CheckCircleOutlineRoundedIcon color="primary" />
            ) : (
              <EditRounded />
            )}
          </IconButton>
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="flex-end">
        <Grid item xs={9}>
          {error ? (
            <Typography variant="caption" color="error">
              Username exists. Please pick another one
            </Typography>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserSettingsUsername;
