import React, { useEffect, useContext, useState } from "react";

import { BugContext } from "../../../context/BugContext";
import { createRestrictedAPIEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import BugUserComment from "./BugUserComment";
import { Grid } from "@material-ui/core";

import Dialog from "../../../layouts/Dialog";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "yellow",
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

  useEffect(() => {
    if (selectedBug.comments !== null) {
      setComments(selectedBug.comments);
    }
    return () => {
      setComments([]);
    };
  }, [selectedBug.comments]);

  const deleteComment = () => {
    createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.COMMENT)
      .delete(commentToDeleteId)
      .then((res) => {
        let comments = selectedBug.comments.filter(
          (comment) => comment.commentId !== commentToDeleteId
        );

        console.log(comments);
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
