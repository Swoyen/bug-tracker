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
import { BugContext } from "../../../context/BugContext";
import { Badge } from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import { useMsal } from "@azure/msal-react";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px",
  },
}));

const BugUserComment = (props) => {
  const classes = useStyles();
  const { comment } = props;
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const { instance, accounts } = useMsal();

  const {
    setOpenCommentConfirmDeleteDialog,
    setCommentToDeleteId,
    setCommentToEdit,
    selectedBug,
    setSelectedBug,
  } = useContext(BugContext);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    //console.log(comment);
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
  }, [comment]);

  const deleteComment = () => {
    setCommentToDeleteId(comment.commentId);
    setOpenCommentConfirmDeleteDialog(true);
  };

  const likeComment = async () => {
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.LIKE
    );
    let result = apiObj.fetchById(comment.commentId);
    result
      .then((res) => {
        setLiked(!liked);
        let temp = selectedBug;
        let likedUsersArr = comment.likedUsers;

        if (likedUsersArr.some((l) => l === currentUser.userId)) {
          var index = likedUsersArr.indexOf(currentUser.userId);
          likedUsersArr.splice(index, 1);
        } else likedUsersArr.push(currentUser.userId);

        let commentIndex = selectedBug.comments.findIndex(
          (com) => com.commentId === comment.commentId
        );
        temp.comments[commentIndex].likedUsers = likedUsersArr;
        setSelectedBug(temp);
        setTotalLikes(likedUsersArr.length);
      })
      .catch((err) => console.log(err));
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
                    onClick={() => deleteComment()}
                    variant="text"
                    margin="none"
                    size="small"
                    style={{ padding: "0px" }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => setCommentToEdit(comment)}
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
                <IconButton onClick={() => likeComment()} size="small">
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
