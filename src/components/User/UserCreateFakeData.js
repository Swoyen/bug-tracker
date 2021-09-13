import { Button, Grid, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import randomWords from "random-words";
import { useDispatch, useSelector } from "react-redux";
import { loadUsers } from "../../store/users";

const UserCreateFakeData = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.entities.users.list);
  const userId = useSelector((state) => state.entities.auth.userId);
  const [usersWithoutCurrent, setUsersWithoutCurrent] = useState([]);

  useEffect(() => {
    dispatch(loadUsers());
  }, []);

  useEffect(() => {
    if (users.length > 0 && userId) {
      setUsersWithoutCurrent(users.filter((user) => user.userId !== userId));
    }
  }, [users, users.length, userId]);

  const assignFakeUsers = () => {
    var assignedUsers = [];
    for (let i = 0; i < usersWithoutCurrent.length; i++) {
      var random = Math.random();
      if (random < 0.3) {
        assignedUsers.push(usersWithoutCurrent[i]);
      }
    }
    return assignedUsers;
  };

  const handleAddProject = () => {
    const formData = new FormData();
    formData.append("title", randomWords());
    console.log(usersWithoutCurrent);
    formData.append("createdTime", new Date().toISOString());
    var assignedUsers = assignFakeUsers();
    if (assignedUsers.length > 0) {
      for (let i = 0; i < assignedUsers.length; i++) {
        formData.append("assignedUsers[]", assignedUsers[i]);
      }
    }
    // got project
    // add this project

    // if (assignedUsers) {
    //   for (var i = 0; i < assignedUsers.length; i++) {
    //     formData.append("assignedUsers[]", assignedUsers[i]);
    //   }
    // }
  };

  const handleAdd = () => {
    handleAddProject();
  };
  return (
    <>
      <Typography align="center" variant="subtitle1">
        Alternatively, you can press the button below to{" "}
        <b>Create Some Fake Data</b>
      </Typography>{" "}
      <Tooltip title="Under Construction">
        <Grid container justifyContent="center">
          <Button
            disabled
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAdd()}
          >
            Create
          </Button>
        </Grid>
      </Tooltip>
    </>
  );
};

export default UserCreateFakeData;
