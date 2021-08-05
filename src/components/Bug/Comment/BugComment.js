import React from "react";
import BugPostComment from "./BugPostComment";
import BugCommentList from "./BugCommentList";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  accountCircle: { background: "white" },
}));

const BugComment = (props) => {
  const classes = useStyles();

  return (
    <>
      <BugPostComment></BugPostComment>
      <BugCommentList></BugCommentList>
    </>
  );
};

export default BugComment;
