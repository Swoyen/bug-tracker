import React, { useContext, useEffect } from "react";
import BugPostComment from "./BugPostComment";
import BugCommentList from "./BugCommentList";

import { makeStyles } from "@material-ui/styles";
import { BugContext } from "../../../context/BugContext";
import Dialog from "../../../layouts/Dialog";
import { RESTRICTEDENDPOINTS, createRestrictedAPIEndPoint } from "../../../api";

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
