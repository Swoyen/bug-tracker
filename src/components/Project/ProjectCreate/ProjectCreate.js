import { Collapse, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";

import CloseIcon from "@material-ui/icons/Close";
import { Fade } from "@material-ui/core";

import Button from "../../../controls/Button";

import ProjectCreateDetails from "./ProjectCreateDetails";
import ProjectCreateAccess from "./ProjectCreateAccess";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  getProjectCreateShown,
  setProjectCreatedShown,
  setProjectCreateShown,
} from "../../../store/projects";
import { loadUsers } from "../../../store/users";
import { Redirect } from "react-router";
import { useRouteMatch } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100vw",
    background: "white",
    height: "100vh",
    zIndex: 12,
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
var redirectId = -1;
var redirect = false;

const ProjectCreate = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const open = useSelector(getProjectCreateShown);

  const [selectedImg, setSelectedImg] = useState();
  const [selectedImgSrc, setSelectedImgSrc] = useState(defaultImgSrc);
  const [projectTitle, setProjectTitle] = useState("");
  // const [errors, setErrors] = useState({});
  const [stage, setStage] = useState(1);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const createdProjectId = useSelector(
    (state) => state.entities.projects.projectCreatedId
  );

  useEffect(() => {
    if (open && createdProjectId && createdProjectId !== -1) {
      redirect = true;
      dispatch(setProjectCreatedShown());
      redirectId = createdProjectId;
    }
  }, [open, createdProjectId]);

  useEffect(() => {
    if (open) dispatch(loadUsers());
    return () => {
      setSelectedImg(null);
      setSelectedImgSrc(defaultImgSrc);
      setProjectTitle("");
      setStage(1);
    };
  }, [open]);

  if (redirect && redirectId !== -1) {
    redirect = false;
    return <Redirect to={{ pathname: `/projects/${redirectId}/bugs` }} />;
  }
  const handleAddProject = async () => {
    const formData = new FormData();
    formData.append("title", projectTitle);
    formData.append("createdTime", new Date().toISOString());
    if (selectedImg) {
      formData.append("imageFile", selectedImg, selectedImg.name);
    }
    if (assignedUsers) {
      for (var i = 0; i < assignedUsers.length; i++) {
        formData.append("assignedUsers[]", assignedUsers[i]);
      }
    }

    let result = dispatch(addProject(formData));
    result
      .then(() => dispatch(setProjectCreateShown(false)))
      .catch((err) => console.log(err));
  };

  const showNext = () => {
    setStage(stage + 1);
  };

  const handleProjectCreateHidden = () => {
    dispatch(setProjectCreateShown(false));
  };

  return (
    <>
      <Fade in={open}>
        <div className={classes.root}>
          <Button
            className={classes.closeButton}
            variant="text"
            onClick={handleProjectCreateHidden}
          >
            <CloseIcon></CloseIcon>
          </Button>

          {stage === 1 ? (
            <ProjectCreateDetails
              {...{
                selectedImg,
                setSelectedImg,
                selectedImgSrc,
                setSelectedImgSrc,
                projectTitle,
                setProjectTitle,
                showNext,
              }}
            ></ProjectCreateDetails>
          ) : (
            <ProjectCreateAccess
              {...{
                addProject: handleAddProject,
                assignedUsers,
                setAssignedUsers,
              }}
            ></ProjectCreateAccess>
          )}
        </div>
      </Fade>
    </>
  );
};

export default ProjectCreate;
