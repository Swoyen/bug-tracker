import React, { useState, useContext, useEffect } from "react";
import { useRef } from "react";

import { Paper, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";
import { Button as MuiButton, IconButton } from "@material-ui/core";

import Popup from "../../layouts/Popup";
import { ProjectContext } from "../../context/ProjectContext";
import { BASE_URL, createProjectAPIEndPoint } from "../../api";
import Button from "../../controls/Button";
import Input from "../../controls/Input";
import Form from "../../layouts/Form";
import Dialog from "../../layouts/Dialog";

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
}));

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
          console.log(data);
        });
    }
    return () => {
      setProjectDetails(null);
      setOpenDeleteConfirmDialog(false);
    };
  }, [openProjectSettings]);

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

  const submitChanges = (event) => {
    event.preventDefault();

    if (
      newProjectTitle !== projectDetails.title ||
      (newSelectedImg && newSelectedImg.name !== projectDetails.imageName)
    ) {
      const formData = new FormData();
      formData.append("projectId", projectDetails.projectId);
      newProjectTitle !== projectDetails.title
        ? formData.append("title", newProjectTitle)
        : console.log("Hello");
      newSelectedImg.name !== projectDetails.imageName
        ? formData.append("imageFile", newSelectedImg, newSelectedImg.name)
        : console.log("Hello");

      // let newProject = {
      //   projectId: projectDetails.projectId,
      //   title: newProjectTitle,
      // };

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
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" color="initial">
                      Project Title
                    </Typography>
                  </Grid>
                  <Grid item container xs={6}>
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
