import React from "react";
import BugPostComment from "./BugPostComment";
import BugCommentList from "./BugCommentList";

import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  accountCircle: { background: "white" },
}));

const BugComment = () => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <BugPostComment></BugPostComment>
      <BugCommentList></BugCommentList>
    </Grid>
  );
};

export default BugComment;
