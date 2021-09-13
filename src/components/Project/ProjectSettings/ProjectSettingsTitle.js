import {
  Grid,
  IconButton,
  Input,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";

// import Input from "../../../controls/Input";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";

const useStyles = makeStyles((theme) => ({
  // input: {
  //   background: "#c1c1c1",
  // },
}));

const ProjectSettingsTitle = (props) => {
  const { newProjectTitle, setNewProjectTitle, authorized } = props;
  const [editProjectTitle, setEditProjectTitle] = useState(false);

  const classes = useStyles();
  return (
    <>
      <Grid item container xs={12} justifyContent="space-between">
        <Grid item xs={4}>
          <Typography variant="body1" color="initial">
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
              <Typography variant="subtitle1">{newProjectTitle}</Typography>
            )}
          </Grid>
        </Grid>
        <Grid item>
          {authorized ? (
            editProjectTitle ? (
              <IconButton
                color="primary"
                size="small"
                aria-label="Edit Project Title"
                onClick={() => setEditProjectTitle(!editProjectTitle)}
              >
                <CheckCircleRoundedIcon fontSize="medium" />
              </IconButton>
            ) : (
              <IconButton
                size="small"
                aria-label="Edit Project Title"
                onClick={() => setEditProjectTitle(!editProjectTitle)}
              >
                <EditIcon fontSize="medium" />
              </IconButton>
            )
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectSettingsTitle;
