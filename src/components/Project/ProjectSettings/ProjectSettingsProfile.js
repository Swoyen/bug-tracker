import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React, { useRef } from "react";
import Button from "../../../controls/Button";

const useStyles = makeStyles((theme) => ({
  projectPic: {
    width: "300px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  uploadButton: {},
}));

const ProjectSettingsProfile = (props) => {
  const { authorized, previewImg, newSelectedImgSrc } = props;
  const classes = useStyles();

  const fileInput = useRef(null);
  return (
    <>
      <Grid item xs={12}>
        <img className={classes.projectPic} src={newSelectedImgSrc} alt="" />
      </Grid>
      <Grid item xs={12}>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={previewImg}
          accept=".jpg, .png"
        ></input>
        {authorized ? (
          <Button
            onClick={() => fileInput.current.click()}
            className={classes.uploadButton}
          >
            Change
          </Button>
        ) : (
          ""
        )}
      </Grid>
    </>
  );
};

export default ProjectSettingsProfile;
