import { Grow, makeStyles, Paper } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    // minHeight: "120px",
    borderRadius: "5px",
    background: "rgba(0,0,0,0.3)",
  },
}));

const ProjectBoardCardMoveSilhouette = (props) => {
  const { visible, height } = props;
  const classes = useStyles();
  return (
    <>
      {visible ? (
        <Grow in={visible}>
          <Paper className={classes.root} style={{ minHeight: height }}></Paper>
        </Grow>
      ) : (
        ""
      )}
    </>
  );
};

export default ProjectBoardCardMoveSilhouette;
