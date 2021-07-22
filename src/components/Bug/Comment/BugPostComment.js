import React, { useContext } from "react";

import {
  Typography,
  TextField,
  InputAdornment,
  makeStyles,
  Tooltip,
  Paper,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

import Button from "../../../controls/Button";
import Form from "../../../layouts/Form";
import { useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { createRestrictedAPIEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import { BugContext } from "../../../context/BugContext";

const maxCommentLength = 300;
const minCommentLength = 4;

const useStyles = makeStyles((theme) => ({
  root: { padding: "10px" },
}));

const BugPostComment = (props) => {
  const classes = useStyles();

  const { selectedBugId, selectedBug, setSelectedBug } = useContext(BugContext);
  const { userDetails } = useContext(UserContext);
  const [commentBody, setCommentBody] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const changeComment = (e) => {
    var newComment = e.target.value;
    if (newComment.length < maxCommentLength) {
      setCommentBody(newComment);
      setTooltipVisible(false);
    } else {
      setTooltipVisible(true);
    }
  };

  const validate = () => {
    if (
      commentBody.length >= minCommentLength &&
      commentBody.length <= maxCommentLength
    )
      return true;
    return false;
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (validate()) {
      let comment = {
        commentId: "0",
        content: commentBody,
        commentedByUserId: userDetails.userId,
        commentedOnBugId: selectedBugId,
      };
      console.log(comment);
      createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.COMMENT)
        .create(comment)
        .then((res) => {
          let data = res.data;
          let prevComments = selectedBug.comments;
          let newComment = data;
          newComment.commentedByUser = userDetails;
          if (prevComments === null) {
            let newComments = [newComment];
            setSelectedBug({ ...selectedBug, comments: newComments });
          } else {
            let newComments = [...selectedBug.comments, newComment];
            setSelectedBug({ ...selectedBug, comments: newComments });
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Form className={classes.root} onSubmit={(e) => submitComment(e)}>
      <Typography gutterBottom>Comments:</Typography>
      <Paper>
        <Tooltip
          title="Max Length of 300 exceeded"
          placement="top"
          open={tooltipVisible}
        >
          <TextField
            id="comment"
            label="Enter Your Comment"
            variant="filled"
            color="primary"
            margin="none"
            size="small"
            value={commentBody}
            onChange={(e) => changeComment(e)}
            multiline
            rows={2}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment
                  className={classes.accountCircle}
                  position="start"
                >
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
        </Tooltip>
        <Button variant="text" type="submit">
          Post
        </Button>
      </Paper>
    </Form>
  );
};

export default BugPostComment;
