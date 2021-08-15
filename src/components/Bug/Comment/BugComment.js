import React from "react";
import BugPostComment from "./BugPostComment";
import BugCommentList from "./BugCommentList";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {},
  accountCircle: { background: "white" },
}));

const BugComment = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <BugPostComment></BugPostComment>
      <BugCommentList></BugCommentList>
    </div>
  );
};

export default BugComment;
