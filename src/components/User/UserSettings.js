import { Container, Grid, Paper, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dialog from "../../layouts/Dialog";
import { deleteCurrentUser, loadCurrentUserFromApi } from "../../store/auth";
import UserSettingsProfilePic from "./UserSettingsProfilePic";
import UserSettingsUserDetails from "./UserSettingsUserDetails";

const UserSettings = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const userDetails = useSelector(
    (state) => state.entities.auth.apiUserDetails
  );
  const [userDeleteConfirm, setUserDeleteConfirm] = useState(false);

  useEffect(() => {
    dispatch(loadCurrentUserFromApi());
  }, [dispatch]);

  useEffect(() => {}, [userDetails]);

  // const handleShowDelete = () => {
  //   setUserDeleteConfirm(true);
  // };

  const handleDeleteAccount = () => {
    dispatch(deleteCurrentUser());
  };

  return (
    <Container maxWidth="md">
      <Typography gutterBottom variant="h5">
        User Details
      </Typography>
      <Paper style={{ padding: theme.spacing(1) }}>
        <Typography gutterBottom variant="h6" color="initial">
          Basic info
        </Typography>
        <Grid container>
          <Grid item xs={4}>
            <UserSettingsProfilePic />
          </Grid>
          <Grid item container xs={6} alignItems="flex-start">
            <UserSettingsUserDetails />
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        title={"⚠️Confirm Delete your account"}
        danger={true}
        openDialog={userDeleteConfirm}
        setOpenDialog={() => setUserDeleteConfirm(false)}
        onConfirm={() => handleDeleteAccount()}
      >
        Are you sure you want to delete this record? This action is irreversible
      </Dialog>
    </Container>
  );
};

export default UserSettings;
