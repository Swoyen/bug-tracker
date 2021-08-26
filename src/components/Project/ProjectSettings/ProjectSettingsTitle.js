import { Grid, IconButton, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Input from "../../../controls/Input";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
  input: {
    background: "#c1c1c1",
  },
}));

const ProjectSettingsTitle = (props) => {
  const {
    editProjectTitle,
    setEditProjectTitle,
    newProjectTitle,
    setNewProjectTitle,
    authorized,
  } = props;
  const classes = useStyles();
  return (
    <>
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
              <Typography variant="subtitle1">{newProjectTitle}</Typography>
            )}
          </Grid>
          <Grid item xs={2}>
            {authorized ? (
              <IconButton
                aria-label="Edit Project Title"
                onClick={() => setEditProjectTitle(!editProjectTitle)}
              >
                <EditIcon />
              </IconButton>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectSettingsTitle;
