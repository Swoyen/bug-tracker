import React, { useContext, useState, useEffect } from "react";

import {
  Paper,
  Grid,
  makeStyles,
  Typography,
  IconButton,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

import { UserContext } from "../../../context/UserContext";
import Button from "../../../controls/Button";
import { Badge } from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { useDispatch } from "react-redux";
import {
  likeComment,
  showCommentDelete,
  startCommentEdit,
} from "../../../store/comments";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px",
  },
}));

const BugUserComment = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { comment } = props;
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (
      comment.likedUsers.length !== 0 &&
      comment.likedUsers.some((id) => id === currentUser.userId)
    ) {
      setLiked(true);
      setTotalLikes(comment.likedUsers.length);
    } else {
      setLiked(false);
      comment.likedUsers.length !== 0
        ? setTotalLikes(comment.likedUsers.length)
        : setTotalLikes(0);
    }
    return () => {};
  }, [comment, currentUser.userId]);

  const handleDelete = (id) => {
    dispatch(showCommentDelete(id));
  };

  const handleLikeComment = (id) => {
    dispatch(likeComment(id));
  };

  const handeStartEditComment = (comment) => {
    dispatch(startCommentEdit(comment));
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
                {comment.commentedByUser
                  ? comment.commentedByUser.userName
                  : ""}
              </Typography>
            </Grid>
            <Grid
              item
              container
              xs={12}
              spacing={1}
              justifyContent="flex-start"
              alignContent="flex-start"
            >
              <Grid item xs={12}>
                <Typography variant="body2" color="initial">
                  {props.children}
                </Typography>
              </Grid>

              {comment.commentedByUser &&
              comment.commentedByUser.userId === currentUser.userId ? (
                <Grid style={{ marginLeft: "-8px" }} item xs={5}>
                  <Button
                    onClick={() => handleDelete(comment.commentId)}
                    variant="text"
                    margin="none"
                    size="small"
                    style={{ padding: "0px" }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={
                      () =>
                        handeStartEditComment(
                          comment
                        ) /*setCommentToEdit(comment)*/
                    }
                    variant="text"
                    size="small"
                    style={{ padding: "0px" }}
                  >
                    Edit
                  </Button>
                </Grid>
              ) : (
                ""
              )}

              <Grid item xs={1}>
                <IconButton
                  onClick={() => handleLikeComment(comment.commentId)}
                  size="small"
                >
                  <Badge badgeContent={totalLikes} color="default">
                    <ThumbUpIcon
                      style={{
                        fontSize: "20px",
                        color: liked ? "#2C75FF" : "inherit",
                      }}
                    ></ThumbUpIcon>
                  </Badge>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default BugUserComment;
