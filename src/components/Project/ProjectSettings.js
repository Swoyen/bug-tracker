import React, { useState, useContext, useEffect } from "react";
import { useRef } from "react";

import {
  Paper,
  Grid,
  Typography,
  responsiveFontSizes,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";
import { Button as MuiButton, IconButton } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";

import Popup from "../../layouts/Popup";
import { ProjectContext } from "../../context/ProjectContext";
import {
  BASE_URL,
  createAPIEndPoint,
  createProjectAPIEndPoint,
  ENDPOINTS,
} from "../../api";
import Button from "../../controls/Button";
import Input from "../../controls/Input";
import Form from "../../layouts/Form";
import Dialog from "../../layouts/Dialog";
import ProjectAccessTag from "./ProjectCreate/ProjectAccessTag";
import { UserContext } from "../../context/UserContext";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: { padding: "20px", border: "none" },
  projectPic: {
    width: "300px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  input: {
    background: "#c1c1c1",
  },
  addedUsers: {},
}));

const emptyUser = {
  userId: "",
  userName: "Select",
  firstName: "",
  lastName: "",
  email: "",
};

const ProjectSettings = () => {
  const classes = useStyles();
  const {
    openProjectSettings,
    setOpenProjectSettings,
    projectIdToModify,
    loadProjectList,
  } = useContext(ProjectContext);

  const [defaultImgSrc, setDefaultImgSrc] = useState("");

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newSelectedImgSrc, setNewSelectedImgSrc] = useState();
  const [newSelectedImg, setNewSelectedImg] = useState();
  const [editProjectTitle, setEditProjectTitle] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const fileInput = useRef(null);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

  const [users, setUsers] = useState([]);
  const [userToAdd, setUserToAdd] = useState(emptyUser);
  const [userToAddInput, setUserToAddInput] = useState("Select");
  const [addedUsers, setAddedUsers] = useState([]);
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    if (openProjectSettings) {
      createProjectAPIEndPoint()
        .fetchById(projectIdToModify)
        .then((res) => {
          let data = res.data;
          setProjectDetails(data);
          setNewProjectTitle(data.title);
          let imgSrc = BASE_URL + "Image/" + data.imageName;
          setDefaultImgSrc(imgSrc);
          setNewSelectedImgSrc(imgSrc);
        })
        .catch((err) => console.log(err));

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
    }
    return () => {
      setProjectDetails({});
      setOpenDeleteConfirmDialog(false);
      setUsers([]);
      setUserToAdd(emptyUser);
      setAddedUsers([]);
      setUserToAddInput("Select");
    };
  }, [openProjectSettings]);

  useEffect(() => {
    (async () => {
      if (projectDetails != null) {
        //add user tags from project access api
        var assignedUserIds = projectDetails.assignedUsers;
        const usersToLoad = assignedUserIds;
        if (usersToLoad) {
          const responses = await loadUsersFromId(usersToLoad);

          let usersFromApi = [];
          for (var i = 0; i < responses.length; i++) {
            console.log(userDetails);
            if (responses[i].data.userId !== userDetails.userId)
              usersFromApi.push(responses[i].data);
          }
          setAddedUsers(usersFromApi);
        }
        //remove name of project created from other user from searchlist
        if (users.length > 0) {
          if (projectDetails != null) {
            var creatorId = projectDetails.creator.userId;
            if (creatorId !== userDetails.userId) {
              let temp = users;

              let result = temp.find((user) => user.userId === creatorId);
              let index = temp.indexOf(result);
              if (index > -1) {
                temp.splice(index, 1);
              }
            }
          }
        }
      }
    })();
  }, [projectDetails]);

  useEffect(() => {
    if (addedUsers) {
      let temp = users;
      temp = temp.filter((user) => {
        return !addedUsers.some((u) => u.userId === user.userId);
      });

      setUsers(temp);
    }
  }, [addedUsers]);

  const loadUsersFromId = async (assignedUserIds) => {
    var responses = [];
    for (var i = 0; i < assignedUserIds.length; i++) {
      var response = await loadUserFromId(assignedUserIds[i]);
      responses.push(response);
    }
    return responses;
  };

  const loadUserFromId = async (assignedUserId) => {
    return await createAPIEndPoint(ENDPOINTS.USER).fetchById(assignedUserId);
  };

  const previewImg = (event) => {
    if (event.target.files && event.target.files[0]) {
      let imageFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setNewSelectedImg(imageFile);
        setNewSelectedImgSrc(x.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setNewSelectedImg(null);
      setNewSelectedImgSrc(defaultImgSrc);
    }
  };

  const addUsers = () => {
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

  const removeAddedUser = (user) => {
    let tempAddedUsers = addedUsers;

    const index = tempAddedUsers.indexOf(user);
    if (index > -1) tempAddedUsers.splice(index, 1);

    setAddedUsers([...tempAddedUsers]);
    setUsers([...users, user]);
  };

  const submitChanges = (event) => {
    event.preventDefault();

    if (
      newProjectTitle !== projectDetails.title ||
      (newSelectedImg && newSelectedImg.name !== projectDetails.imageName) ||
      !compareAccessUsers()
    ) {
      const formData = new FormData();
      formData.append("projectId", projectDetails.projectId);
      if (newProjectTitle !== projectDetails.title)
        formData.append("title", newProjectTitle);
      if (newSelectedImg && newSelectedImg.name !== projectDetails.imageName)
        formData.append("imageFile", newSelectedImg, newSelectedImg.name);
      if (!compareAccessUsers()) {
        let currentAccessUserIds = [];
        addedUsers.forEach((user) => currentAccessUserIds.push(user.userId));
        for (var i = 0; i < currentAccessUserIds.length; i++) {
          formData.append("assignedUsers[]", currentAccessUserIds[i]);
        }
      }
      createProjectAPIEndPoint()
        .update(projectIdToModify, formData)
        .then((res) => {
          console.log("updated");
          loadProjectList();
        })
        .catch((err) => console.log(err));
    }

    setOpenProjectSettings(false);
  };

  const compareAccessUsers = () => {
    const prevAccessUserIds = projectDetails.assignedUsers;
    const prevAccessUserIdsWithoutCurrentUser = prevAccessUserIds.filter(
      (userId) => userId != userDetails.userId
    );

    let currentAccessUserIds = [];
    addedUsers.forEach((user) => currentAccessUserIds.push(user.userId));

    let cond1 = currentAccessUserIds.every((userId) =>
      prevAccessUserIdsWithoutCurrentUser.includes(userId)
    );
    let cond2 = prevAccessUserIdsWithoutCurrentUser.every((userId) =>
      currentAccessUserIds.includes(userId)
    );

    let cond = cond1 && cond2;
    return cond;
  };

  const deleteProject = (event) => {
    createProjectAPIEndPoint()
      .delete(projectDetails.projectId)
      .then((res) => loadProjectList());

    setOpenProjectSettings(false);
  };

  return (
    <Popup
      maxWidth="sm"
      openPopup={openProjectSettings}
      setOpenPopup={setOpenProjectSettings}
    >
      {projectDetails ? (
        <>
          <Paper className={classes.paper} variant="outlined">
            <Form onSubmit={submitChanges}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <img
                    className={classes.projectPic}
                    src={newSelectedImgSrc}
                    alt=""
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInput}
                    onChange={previewImg}
                    accept=".jpg, .png"
                  ></input>
                  <Button
                    onClick={() => fileInput.current.click()}
                    className={classes.uploadButton}
                  >
                    Change
                  </Button>
                </Grid>
                <Grid item container xs={12}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" color="initial">
                      Project Title
                    </Typography>
                  </Grid>
                  <Grid item container xs={8}>
                    <Grid item xs={10}>
                      {editProjectTitle ? (
                        <Input
                          className={classes.input}
                          variant="standard"
                          margin="dense"
                          value={newProjectTitle}
                          onChange={(e) => setNewProjectTitle(e.target.value)}
                        ></Input>
                      ) : (
                        <Typography variant="subtitle1">
                          {newProjectTitle}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        aria-label="Edit Project Title"
                        onClick={() => setEditProjectTitle(!editProjectTitle)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
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
                      getOptionLabel={(option) =>
                        option ? option.userName : ""
                      }
                      getOptionSelected={(option, value) => {
                        return option.userId === value.userId;
                      }}
                      getOptionDisabled={(option) => option === emptyUser}
                      id="clear-on-escape"
                      clearOnEscape
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select User"
                          margin="normal"
                        />
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
                <Grid item xs={12}>
                  <Button type="submit">Confirm Changes</Button>
                  <Button onClick={() => setOpenDeleteConfirmDialog(true)}>
                    Delete Project
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Paper>
          <Dialog
            title="Confirm Delete"
            openDialog={openDeleteConfirmDialog}
            setOpenDialog={setOpenDeleteConfirmDialog}
            onConfirm={() => deleteProject()}
          >
            Are you sure you want to delete this project?
          </Dialog>
        </>
      ) : (
        ""
      )}
    </Popup>
  );
};

export default ProjectSettings;
