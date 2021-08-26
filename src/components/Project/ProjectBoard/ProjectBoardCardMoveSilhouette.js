import { makeStyles, Paper } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    minHeight: "120px",
    borderRadius: "5px",
    background: "rgba(0,0,0,0.3)",
  },
}));

const ProjectBoardCardMoveSilhouette = (props) => {
  const { visible } = props;
  const classes = useStyles();
  return <>{visible ? <Paper className={classes.root}></Paper> : ""} </>;
};

export default ProjectBoardCardMoveSilhouette;
