import React, { useEffect, useContext } from "react";
import BugUserComment from "./BugUserComment";
import { Grid } from "@material-ui/core";

import Dialog from "../../../layouts/Dialog";
import { makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllComments,
  getCommentDeleteShown,
  getCommentIdToDelete,
  hideCommentDelete,
  loadComments,
  removeComment,
} from "../../../store/comments";
import { getShownBug } from "../../../store/bug";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "500px",
    overflow: "auto",
  },
}));

const BugCommentList = () => {
  const dispatch = useDispatch();
  const comments = useSelector(getAllComments);
  const { id: bugId, shown } = useSelector(getShownBug);
  const commentIdToDelete = useSelector(getCommentIdToDelete);
  const deleteVisible = useSelector(getCommentDeleteShown);

  useEffect(() => {
    if (shown) dispatch(loadComments(bugId));
  }, [shown]);

  const classes = useStyles();

  const handleDeleteConfirm = async () => {
    dispatch(removeComment(commentIdToDelete));
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
        openDialog={deleteVisible}
        setOpenDialog={() => dispatch(hideCommentDelete())}
        top="250px"
        onConfirm={() => handleDeleteConfirm()}
      >
        Are you sure you want to delete this comment?
      </Dialog>
    </Grid>
  );
};

export default BugCommentList;
