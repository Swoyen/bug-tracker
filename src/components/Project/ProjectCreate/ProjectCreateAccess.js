import React, { useState, useEffect, useContext } from "react";

import { Typography, Grid, makeStyles, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import Form from "../../../layouts/Form";
import Button from "../../../controls/Button";
import ProjectAccessTag from "./ProjectAccessTag";
import { UserContext } from "../../../context/UserContext";
import { useSelector } from "react-redux";
import { getProjectCreateShown } from "../../../store/projects";
import { getAllUsers } from "../../../store/users";

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
  //const [users, setUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userToAdd, setUserToAdd] = useState(emptyUser);
  const [userToAddInput, setUserToAddInput] = useState("");

  const openProjectCreate = useSelector(getProjectCreateShown);
  const allUsers = useSelector(getAllUsers);

  const { addProject, setAssignedUsers } = props;
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (openProjectCreate) {
      if (allUsers && allUsers.length > 0) {
        let data = [...allUsers];
        let index = data.findIndex(
          (user) => user.userId === currentUser.userId
        );
        if (index > -1) data.splice(index, 1);
        var users = [emptyUser, ...data];
        setUsers(users);
      }
    }
  }, [openProjectCreate, allUsers]);

  useEffect(() => {
    let userIds = [];
    addedUsers.forEach((user) => {
      userIds.push(user.userId);
    });
    setAssignedUsers(userIds);
  }, [addedUsers, setAssignedUsers]);

  const handleAddUsersToList = () => {
    if (userToAdd.userId !== "" && users.includes(userToAdd)) {
      let temp = users;
      const index = temp.indexOf(userToAdd);
      if (index > -1) {
        temp.splice(index, 1);
      }
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
    addProject();
  };

  const handleRemoveAddedUsers = (user) => {
    let tempAddedUsers = addedUsers;

    const index = tempAddedUsers.indexOf(user);
    if (index > -1) tempAddedUsers.splice(index, 1);

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
              <Button onClick={handleAddUsersToList}>Add</Button>
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
                    removeAddedUser={handleRemoveAddedUsers}
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
