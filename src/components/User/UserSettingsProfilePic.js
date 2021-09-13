import { Avatar, Button, Grid } from "@material-ui/core";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, RESTRICTEDENDPOINTS } from "../../api/config";
import { modifyCurrentUser } from "../../store/auth";
import {
  enqueueErrorSnackbar,
  enqueueSuccessSnackbar,
} from "../../store/notifier";

const fileSizeLimitInKb = 500000;
const fileSizeLimitInMb = fileSizeLimitInKb / 1000;

const UserSettingsProfilePic = () => {
  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const currentUser = useSelector(
    (state) => state.entities.auth.apiUserDetails
  );

  const handleAttach = (e) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const formData = new FormData();

        formData.append("userId", currentUser.userId);
        formData.append("email", currentUser.email);
        formData.append("fullName", currentUser.fullName);
        formData.append("userName", currentUser.userName);
        formData.append("profileImageFile", file);

        const fileSizeInKb = file.size / 1000;
        if (fileSizeInKb < fileSizeLimitInKb) {
          dispatch(modifyCurrentUser(formData));
        } else {
          dispatch(
            enqueueErrorSnackbar(
              `File size is greater than limit(${fileSizeLimitInMb}Mb)`
            )
          );
        }
      };

      reader.readAsDataURL(file);
    } else {
      dispatch(enqueueErrorSnackbar(`Error uploading`));
    }
  };
  return (
    <Grid container alignItems="center" direction="column" spacing={1}>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInput}
        onChange={handleAttach}
        accept="."
      ></input>
      <Grid item>
        {currentUser.profileImageName ? (
          <Avatar
            src={`${BASE_URL}${RESTRICTEDENDPOINTS.IMAGE}/${currentUser.profileImageName}`}
            style={{ width: "250px", height: "250px" }}
          ></Avatar>
        ) : (
          <Avatar style={{ width: "250px", height: "250px" }}></Avatar>
        )}
      </Grid>
      <Grid item>
        <Button onClick={() => fileInput.current.click()}>
          Set Profile Pic
        </Button>
      </Grid>
    </Grid>
  );
};

export default UserSettingsProfilePic;
