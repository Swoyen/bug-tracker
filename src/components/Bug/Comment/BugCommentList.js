import React, { useEffect, useContext, useState } from "react";

import { BugContext } from "../../../context/BugContext";
import {
  createAuthenticatedEndPoint,
  createRestrictedAPIEndPoint,
  RESTRICTEDENDPOINTS,
} from "../../../api";
import BugUserComment from "./BugUserComment";
import { Grid } from "@material-ui/core";

import Dialog from "../../../layouts/Dialog";
import { makeStyles } from "@material-ui/core";
import { useMsal } from "@azure/msal-react";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "500px",
    overflow: "auto",
  },
}));

const BugCommentList = () => {
  const classes = useStyles();
  const {
    selectedBug,
    setSelectedBug,
    openCommentConfirmDeleteDialog,
    setOpenCommentConfirmDeleteDialog,
    commentToDeleteId,
    comments,
    setComments,
  } = useContext(BugContext);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (selectedBug.comments !== null) {
      setComments(selectedBug.comments);
    }
    return () => {
      setComments([]);
    };
  }, [selectedBug.comments]);

  const deleteComment = async () => {
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.COMMENT
    );
    let result = apiObj.delete(commentToDeleteId);
    result
      .then((res) => {
        let comments = selectedBug.comments.filter(
          (comment) => comment.commentId !== commentToDeleteId
        );

        setSelectedBug({ ...selectedBug, comments: comments });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Grid
      className={classes.root}
      container
      justifyContent="center"
      spacing={1}
    >
      {comments
        ? comments.map((comment) => (
            <Grid item xs={11} key={comment.commentId}>
              <BugUserComment comment={comment}>
                {comment.content}
              </BugUserComment>
            </Grid>
          ))
        : ""}
      <Dialog
        title="Confirm Delete"
        openDialog={openCommentConfirmDeleteDialog}
        setOpenDialog={setOpenCommentConfirmDeleteDialog}
        top="250px"
        onConfirm={() => deleteComment()}
      >
        Are you sure you want to delete this comment?
      </Dialog>
    </Grid>
  );
};

export default BugCommentList;
