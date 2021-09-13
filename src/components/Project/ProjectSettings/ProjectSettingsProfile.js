import { Button, makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React, { useRef } from "react";
import ImageIcon from "@material-ui/icons/Image";

const useStyles = makeStyles((theme) => ({
  projectPic: {
    width: "535px",
    height: "400px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  modifyButton: { position: "absolute", right: "55px", top: "60px" },
}));

const ProjectSettingsProfile = (props) => {
  const { authorized, previewImg, newSelectedImgSrc } = props;
  const classes = useStyles();

  const fileInput = useRef(null);
  return (
    <>
      <Grid item xs={12}>
        {authorized ? (
          <Button
            startIcon={<ImageIcon />}
            variant="contained"
            color="secondary"
            onClick={() => fileInput.current.click()}
            className={classes.modifyButton}
          >
            Modify
          </Button>
        ) : (
          ""
        )}
        <img
          className={classes.projectPic}
          src={newSelectedImgSrc}
          alt=""
        ></img>
      </Grid>
      <Grid item xs={12}>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={previewImg}
          accept=".jpg, .png"
        ></input>
      </Grid>
    </>
  );
};

export default ProjectSettingsProfile;
