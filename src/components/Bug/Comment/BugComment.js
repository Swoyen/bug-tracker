import React from "react";
import BugPostComment from "./BugPostComment";
import BugCommentList from "./BugCommentList";

import { makeStyles } from "@material-ui/styles";
import { Grid, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {},
  accountCircle: { background: "white" },
  subheading: { paddingLeft: theme.spacing(1) },
}));

const BugComment = () => {
  const classes = useStyles();

  const { resolved } = useSelector((state) => state.entities.bug.loadedBug);
  return (
    <Grid item xs={12}>
      {resolved ? "" : <BugPostComment></BugPostComment>}
      <Typography variant="subtitle2" color="initial">
        Comments:
      </Typography>
      <BugCommentList></BugCommentList>
    </Grid>
  );
};

export default BugComment;
