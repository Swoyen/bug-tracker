import { makeStyles, Grid, Typography } from "@material-ui/core";
import React, {
  useState,
  useContext,
  createRef,
  useRef,
  useEffect,
} from "react";

import CloseIcon from "@material-ui/icons/Close";
import { Fade, Collapse } from "@material-ui/core";

import { ProjectContext } from "../../context/ProjectContext";
import Popup from "../../layouts/Popup";
import Button from "../../controls/Button";
import Form from "../../layouts/Form";
import Input from "../../controls/Input";
import {
  createAPIEndPoint,
  createProjectAPIEndPoint,
  ENDPOINTS,
} from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100vw",
    background: "white",
    height: "100vh",
    zIndex: "100000",
  },

  closeButton: {
    position: "absolute",
    right: "0px",
  },

  createForm: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    padding: "10px",
    textAlign: "center",
  },
  projectImgContainer: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "gray",
    overflow: "hidden",
  },
  projectImg: {
    width: "100%",
    height: "100%",
  },
  submitButton: {
    position: "absolute",
    left: "0px",
    marginLeft: "20px",
  },
}));

const defaultImgSrc = "/img/default.jpg";

const ProjectCreate = () => {
  const classes = useStyles();
  const {
    projectList,
    loadProjectList,
    openProjectCreate,
    setOpenProjectCreate,
  } = useContext(ProjectContext);

  const [selectedImg, setSelectedImg] = useState();
  const [selectedImgSrc, setSelectedImgSrc] = useState(defaultImgSrc);
  const [projectTitle, setProjectTitle] = useState("");
  const [errors, setErrors] = useState({});

  const fileInput = useRef(null);

  useEffect(() => {
    setSelectedImg(null);
    setSelectedImgSrc(defaultImgSrc);
    setProjectTitle("");
  }, [openProjectCreate]);

  const uploadProject = (event) => {
    event.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("title", projectTitle);
      formData.append("createdTime", "2021-07-12T02:29:54.605Z");
      if (selectedImg) {
        formData.append("imageFile", selectedImg, selectedImg.name);
      }
      createProjectAPIEndPoint()
        .create(formData)
        .then((res) => {
          setOpenProjectCreate(false);
          loadProjectList();
        })
        .catch((err) => console.log(err));
    }
  };

  const validate = () => {
    if (projectTitle === "") {
      setErrors({ ...errors, projectTitle: "Title cannot be empty." });
      return false;
    } else {
      if (projectList.some((project) => project.title === projectTitle)) {
        setErrors({ ...errors, projectTitle: "Project already exists." });
        return false;
      }
    }
    return true;
  };

  const previewImg = (event) => {
    //setSelectedFile(event);
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      let imageFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setSelectedImg(imageFile);
        setSelectedImgSrc(x.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setSelectedImg(null);
      setSelectedImgSrc(defaultImgSrc);
    }
  };

  return (
    <>
      {openProjectCreate ? (
        <Fade in={openProjectCreate}>
          <div className={classes.root}>
            <Button
              className={classes.closeButton}
              variant="text"
              onClick={() => setOpenProjectCreate(false)}
            >
              <CloseIcon></CloseIcon>
            </Button>
            <Form
              onSubmit={(e) => uploadProject(e)}
              className={classes.createForm}
            >
              <Grid container justify="center" spacing={3}>
                <Grid item xs={12}>
                  <Typography align="left" variant="h3" color="initial">
                    Create Project
                  </Typography>
                </Grid>
                <Grid
                  item
                  container
                  spacing={1}
                  alignContent="flex-start"
                  xs={6}
                >
                  <Grid item xs={12}>
                    <Input
                      fullWidth
                      variant="filled"
                      margin="dense"
                      label="Project Title"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      error={errors.projectTitle}
                    ></Input>
                    <Typography align="left" variant="subtitle2">
                      This will be the project identifier
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      fullWidth
                      variant="filled"
                      margin="dense"
                      label="Project Description"
                    ></Input>
                  </Grid>
                </Grid>
                <Grid item container xs={6} spacing={1}>
                  <Grid item xs={12}>
                    <div className={classes.projectImgContainer}>
                      <img
                        className={classes.projectImg}
                        src={selectedImgSrc}
                        alt=""
                        style={{ width: "300px" }}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={10}>
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
                      Upload
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {/* <Button onClick={() => uploadImg()}>Upload img</Button> */}
                  <Button className={classes.submitButton} type="submit">
                    Create
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </div>
        </Fade>
      ) : (
        ""
      )}
    </>
  );
};

export default ProjectCreate;
