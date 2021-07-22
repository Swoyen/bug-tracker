import React, { useContext, useState, useEffect } from "react";

import {
  Paper,
  Grid,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import { AccountCircle, Delete } from "@material-ui/icons";

import { UserContext } from "../../../context/UserContext";
import Button from "../../../controls/Button";
import Dialog from "../../../layouts/Dialog";
import { BugContext } from "../../../context/BugContext";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px",
  },
}));

const BugUserComment = (props) => {
  const classes = useStyles();
  const { comment } = props;

  const {
    openCommentConfirmDeleteDialog,
    setOpenCommentConfirmDeleteDialog,
    setCommentToDeleteId,
  } = useContext(BugContext);
  const { userDetails } = useContext(UserContext);
  const [] = useState(false);

  const deleteComment = () => {
    setCommentToDeleteId(comment.commentId);
    setOpenCommentConfirmDeleteDialog(true);
  };

  return (
    <>
      <Paper className={classes.root}>
        <Grid container spacing={2}>
          <Grid item container xs={1}>
            <AccountCircle style={{ fontSize: "30px" }}></AccountCircle>
          </Grid>
          <Grid item container xs={10} spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="initial">
                {comment.commentedByUser.userName}
              </Typography>
            </Grid>
            <Grid item container xs={12} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body2" color="initial">
                  {props.children}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {comment.commentedByUser.userId === userDetails.userId ? (
                  <Button
                    onClick={() => deleteComment()}
                    variant="outlined"
                    margin="none"
                    size="small"
                  >
                    Delete
                  </Button>
                ) : (
                  ""
                )}
                <Button variant="outlined" size="small">
                  Reply
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default BugUserComment;
