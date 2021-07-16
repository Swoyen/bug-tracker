import React, { useState, useEffect, useContext } from "react";

import {
  Typography,
  Grid,
  makeStyles,
  Avatar,
  TextField,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Close";

import Input from "../../../controls/Input";
import Form from "../../../layouts/Form";
import Button from "../../../controls/Button";
import { createAPIEndPoint, ENDPOINTS } from "../../../api";
import ProjectAccessTag from "./ProjectAccessTag";
import { UserContext } from "../../../context/UserContext";

const useStyles = makeStyles((theme) => ({
  root: {},
  accessForm: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    padding: "10px",
    textAlign: "center",
  },

  avatars: {
    marginTop: "40px",
    padding: "10px",
  },
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 19,
    },
  },
}));

const emptyUser = {
  userId: "",
  userName: "Select",
  firstName: "",
  lastName: "",
  email: "",
};

const ProjectCreateAccess = (props) => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [userToAdd, setUserToAdd] = useState(emptyUser);
  const [userToAddInput, setUserToAddInput] = useState("");
  const { openProjectCreate, uploadProject, assignedUsers, setAssignedUsers } =
    props;
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    if (openProjectCreate)
      createAPIEndPoint(ENDPOINTS.USER)
        .fetchAll()
        .then((res) => {
          let data = res.data;
          let index = data.findIndex(
            (user) => user.userId === userDetails.userId
          );
          if (index > -1) data.splice(index, 1);
          var users = [emptyUser, ...data];
          setUsers(users);
        })
        .catch((err) => console.log(err));
  }, [openProjectCreate]);

  useEffect(() => {
    let userIds = [];
    addedUsers.forEach((user) => {
      userIds.push(user.userId);
    });
    setAssignedUsers(userIds);
  }, [addedUsers]);

  const addUsers = () => {
    if (userToAdd.userId !== "" && users.includes(userToAdd)) {
      let temp = users;
      const index = temp.indexOf(userToAdd);
      if (index > -1) {
        temp.splice(index, 1);
      }

      console.log(userToAdd.userId);
      console.log(temp);

      //remove added user from searchlist
      setUsers(temp);

      setAddedUsers([...addedUsers, userToAdd]);

      //setting autocomplete to default
      setUserToAdd(users[0]);
      setUserToAddInput("Select");
    }
  };

  const submitForm = (event) => {
    event.preventDefault();

    uploadProject();
  };

  const removeAddedUser = (user) => {
    let tempAddedUsers = addedUsers;

    const index = tempAddedUsers.indexOf(user);
    if (index > -1) tempAddedUsers.splice(index, 1);
    console.log(tempAddedUsers);
    console.log("removed", index);

    setAddedUsers([...tempAddedUsers]);

    setUsers([...users, user]);
  };

  return (
    <>
      <Form onSubmit={submitForm} className={classes.accessForm}>
        <Grid container justifyContent="center" spacing={3}>
          <Grid item xs={12}>
            <Typography align="left" variant="h3" color="initial">
              Set Access
            </Typography>
          </Grid>
          <Grid item container spacing={1} xs={12}>
            <Grid item xs={8}>
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
            <Grid item xs={4}>
              <Button onClick={addUsers}>Add</Button>
            </Grid>
            <Grid
              className={classes.avatars}
              item
              container
              spacing={3}
              justifyContent="flex-start"
            >
              {addedUsers.map((user) => {
                return (
                  <ProjectAccessTag
                    key={user.userId}
                    user={user}
                    removeAddedUser={removeAddedUser}
                  ></ProjectAccessTag>
                );
              })}
            </Grid>
          </Grid>
          <Button type="submit">Create Project</Button>
        </Grid>
      </Form>
    </>
  );
};

export default ProjectCreateAccess;
