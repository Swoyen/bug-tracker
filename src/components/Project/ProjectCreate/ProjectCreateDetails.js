import React, { useState, useRef } from "react";

import { makeStyles } from "@material-ui/styles";
import { Grid, Typography } from "@material-ui/core";

import Input from "../../../controls/Input";
import Form from "../../../layouts/Form";
import Button from "../../../controls/Button";

const useStyles = makeStyles((theme) => ({
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
const ProjectCreateDetails = (props) => {
  const classes = useStyles();
  const {
    setSelectedImg,
    selectedImgSrc,
    setSelectedImgSrc,
    projectTitle,
    setProjectTitle,
    showNext,
  } = props;
  const [errors, setErrors] = useState({});
  const fileInput = useRef(null);

  const validate = () => {
    if (projectTitle === "") {
      setErrors({ projectTitle: "Project title is required." });
      return false;
    }
    return true;
  };

  const previewImg = (event) => {
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

  const submitDetails = (event) => {
    event.preventDefault();
    if (validate()) {
      showNext();
    }
  };

  return (
    <Form onSubmit={(e) => submitDetails(e)} className={classes.createForm}>
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={12}>
          <Typography align="left" variant="h4" color="initial">
            Create Project
          </Typography>
        </Grid>
        <Grid item container spacing={1} alignContent="flex-start" xs={6}>
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
            Next
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};

export default ProjectCreateDetails;
