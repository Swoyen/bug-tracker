import React, { useEffect, useContext, useState } from "react";

import { BugContext } from "../../../context/BugContext";
import { createRestrictedAPIEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import BugUserComment from "./BugUserComment";
import { Grid } from "@material-ui/core";

import Dialog from "../../../layouts/Dialog";

const BugCommentList = () => {
  const {
    selectedBug,
    setSelectedBug,
    openCommentConfirmDeleteDialog,
    setOpenCommentConfirmDeleteDialog,
    commentToDeleteId,
  } = useContext(BugContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (selectedBug.comments !== null) {
      setComments(selectedBug.comments);
      console.log("loadedComments", selectedBug.comments);
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
    <Grid container justifyContent="center" spacing={1}>
      {comments
        ? comments.map((comment) => (
            <Grid item xs={10} key={comment.commentId}>
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
