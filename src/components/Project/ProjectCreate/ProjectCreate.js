import { makeStyles } from "@material-ui/core";
import React, { useState, useContext, useEffect } from "react";
import { useMsal } from "@azure/msal-react";

import CloseIcon from "@material-ui/icons/Close";
import { Fade } from "@material-ui/core";

import { ProjectContext } from "../../../context/ProjectContext";

import Button from "../../../controls/Button";

import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import ProjectCreateDetails from "./ProjectCreateDetails";
import ProjectCreateAccess from "./ProjectCreateAccess";

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

const ProjectCreate = () => {
  const classes = useStyles();
  const { loadProjectList, openProjectCreate, setOpenProjectCreate } =
    useContext(ProjectContext);

  const { instance, accounts } = useMsal();
  const [selectedImg, setSelectedImg] = useState();
  const [selectedImgSrc, setSelectedImgSrc] = useState(defaultImgSrc);
  const [projectTitle, setProjectTitle] = useState("");
  // const [errors, setErrors] = useState({});
  const [stage, setStage] = useState(1);
  const [assignedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    setSelectedImg(null);
    setSelectedImgSrc(defaultImgSrc);
    setProjectTitle("");
    setStage(1);
  }, [openProjectCreate]);

  const uploadProject = async () => {
    const formData = new FormData();
    formData.append("title", projectTitle);
    formData.append("createdTime", "2021-07-12T02:29:54.605Z");
    if (selectedImg) {
      formData.append("imageFile", selectedImg, selectedImg.name);
    }

    if (assignedUsers) {
      for (var i = 0; i < assignedUsers.length; i++) {
        formData.append("assignedUsers[]", assignedUsers[i]);
      }
    }
    var apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.PROJECT
    );
    if (apiObj) {
      var result = apiObj.create(formData);
      result
        .then((res) => {
          setOpenProjectCreate(false);
          console.log("Project uploaded");
          loadProjectList();
        })
        .catch((err) => console.log(err));
    }

    // createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.PROJECT)
    //   .create(formData)
    //   .then((res) => {
    //     setOpenProjectCreate(false);
    //     console.log("Project upploaded");
    //     loadProjectList();
    //   })
    //   .catch((err) => console.log(err));
  };

  const showNext = () => {
    setStage(stage + 1);
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
                  openProjectCreate,
                  uploadProject,
                  assignedUsers,
                  setAssignedUsers,
                }}
              ></ProjectCreateAccess>
            )}
          </div>
        </Fade>
      ) : (
        ""
      )}
    </>
  );
};

export default ProjectCreate;
