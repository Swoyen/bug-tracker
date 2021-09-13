import React, { useState, useContext, useEffect } from "react";

import { Paper, Grid, Typography, Button, Divider } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";

import Popup from "../../../layouts/Popup";
import { BASE_URL } from "../../../api/config";

import Input from "../../../controls/Input";
import Form from "../../../layouts/Form";
import Dialog from "../../../layouts/Dialog";
import ProjectAccessTag from "../ProjectCreate/ProjectAccessTag";
import { UserContext } from "../../../context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import DoneOutlineRoundedIcon from "@material-ui/icons/DoneOutlineRounded";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import {
  getLoadedProject,
  getProjectShown,
  modifyProject,
  removeProject,
  setProjectSettingsShown,
} from "../../../store/projects";
import { getAllUsers, getAssignedUsers, loadUsers } from "../../../store/users";
import ProjectSettingsProfile from "./ProjectSettingsProfile";
import ProjectSettingsTitle from "./ProjectSettingsTitle";
import ProjectSettingsAccess from "./ProjectSettingsAccess";
import { CopyrightTwoTone } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: { border: "none" },
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
  const dispatch = useDispatch();
  const theme = useTheme();

  const projectIdToShow = useSelector(getProjectShown);
  const projectDetails = useSelector(getLoadedProject);
  const [openProjectSettings, setOpenProjectSettings] = useState(false);

  const [defaultImgSrc, setDefaultImgSrc] = useState("");
  const [newSelectedImgSrc, setNewSelectedImgSrc] = useState();
  const [newSelectedImg, setNewSelectedImg] = useState();

  const [users, setUsers] = useState([]);
  const [userToAdd, setUserToAdd] = useState(emptyUser);
  const [userToAddInput, setUserToAddInput] = useState("Select");
  const [addedUsers, setAddedUsers] = useState([]);

  const [authorized, setAuthorized] = useState(false);

  const loadedUsers = useSelector(getAllUsers);
  const assignedUsers = useSelector(getAssignedUsers);

  const [newProjectTitle, setNewProjectTitle] = useState("");

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (
      openProjectSettings &&
      assignedUsers.length >= 0 &&
      loadedUsers.length > 0
    ) {
      let data = [...loadedUsers];
      let index = data.findIndex((user) => user.userId === currentUser.userId);
      if (index > -1) data.splice(index, 1);

      var users = [emptyUser, ...data];
      setUsers(users);
      setAddedUsers([...assignedUsers]);
    }
  }, [loadedUsers, assignedUsers, openProjectSettings]);
  useEffect(() => {
    if (
      projectIdToShow !== -1 &&
      Object.keys(projectDetails).length > 0 &&
      currentUser
    ) {
      dispatch(loadUsers());
      setOpenProjectSettings(true);
      setNewProjectTitle(projectDetails.title);
      setAuthorized(currentUser.userId === projectDetails.creator.userId);

      let imgSrc = BASE_URL + "Image/" + projectDetails.imageName;
      setDefaultImgSrc(imgSrc);
      setNewSelectedImgSrc(imgSrc);
    } else setOpenProjectSettings(false);

    return () => {
      setOpenProjectSettings(false);
    };
  }, [projectIdToShow, projectDetails, currentUser]);

  useEffect(() => {
    if (addedUsers && openProjectSettings) {
      setUsers((users) =>
        users.filter(
          (user) => !addedUsers.some((u) => u.userId === user.userId)
        )
      );
    }
  }, [addedUsers, openProjectSettings]);

  // const loadUserFromId = async (assignedUserId) => {
  //   //return await createAPIEndPoint(ENDPOINTS.USER).fetchById(assignedUserId);
  // };

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

  const compareAccessUsers = () => {
    const prevAccessUserIds = projectDetails.assignedUsers;
    const prevAccessUserIdsWithoutCurrentUser = prevAccessUserIds.filter(
      (userId) => userId !== currentUser.userId
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
  const handleSubmit = (event) => {
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
      dispatch(modifyProject(projectDetails.projectId, formData));
    }

    dispatch(setProjectSettingsShown(false));
  };

  const handleDeleteProject = () => {
    dispatch(removeProject(projectIdToShow));
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
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <ProjectSettingsProfile
                  previewImg={previewImg}
                  newSelectedImgSrc={newSelectedImgSrc}
                  authorized={authorized}
                ></ProjectSettingsProfile>

                <ProjectSettingsTitle
                  newProjectTitle={newProjectTitle}
                  setNewProjectTitle={setNewProjectTitle}
                  authorized={authorized}
                ></ProjectSettingsTitle>

                <ProjectSettingsAccess
                  {...{
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
                  }}
                ></ProjectSettingsAccess>

                <Grid item xs={12} container justifyContent="flex-end">
                  {authorized ? (
                    <>
                      <Grid item>
                        <Button
                          startIcon={<CancelRoundedIcon />}
                          variant="outlined"
                          style={{ marginRight: "8px" }}
                          onClick={() => setOpenDeleteConfirmDialog(true)}
                        >
                          Delete
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          color="primary"
                          startIcon={<DoneOutlineRoundedIcon />}
                          type="submit"
                          variant="outlined"
                        >
                          Confirm
                        </Button>
                      </Grid>
                    </>
                  ) : (
                    <Button onClick={() => setOpenProjectSettings(false)}>
                      Cancel
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Form>
          </Paper>

          <Dialog
            title="Confirm Delete"
            openDialog={openDeleteConfirmDialog}
            setOpenDialog={setOpenDeleteConfirmDialog}
            onConfirm={() => handleDeleteProject()}
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
