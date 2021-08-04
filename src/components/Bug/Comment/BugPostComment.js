import React, { useContext, useEffect } from "react";

import {
  Typography,
  TextField,
  InputAdornment,
  makeStyles,
  Tooltip,
  Paper,
  IconButton,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

import Button from "../../../controls/Button";
import Form from "../../../layouts/Form";
import { useState } from "react";
import { UserContext } from "../../../context/UserContext";
import {
  createAuthenticatedEndPoint,
  createRestrictedAPIEndPoint,
  RESTRICTEDENDPOINTS,
} from "../../../api";
import { BugContext } from "../../../context/BugContext";
import { useRef } from "react";
import { useMsal } from "@azure/msal-react";

const maxCommentLength = 300;
const minCommentLength = 4;

const useStyles = makeStyles((theme) => ({
  root: { padding: "10px" },
  submitButton: { marginLeft: "10px" },
}));

const BugPostComment = (props) => {
  const classes = useStyles();

  const {
    selectedBugId,
    selectedBug,
    setSelectedBug,
    commentToEdit,
    setCommentToEdit,
  } = useContext(BugContext);
  const { userDetails, currentUser } = useContext(UserContext);
  const [commentBody, setCommentBody] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editCommentBody, setEditCommentBody] = useState("");
  const { instance, accounts } = useMsal();
  const ref = useRef();

  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current.contains(event.target)) {
        return;
      }
      setInputFocused(false);
    };
    document.body.addEventListener("click", onBodyClick, { capture: true });
    return () => {
      document.body.removeEventListener("click", onBodyClick, {
        capture: true,
      });
    };
  }, []);

  useEffect(() => {
    if (commentToEdit.commentId !== undefined) {
      console.log("Comment edit", commentToEdit);
      setIsEditingComment(true);
      setInputFocused(true);
      setEditCommentBody(commentToEdit.content);
    }
  }, [commentToEdit]);

  const changeComment = (e) => {
    var newComment = e.target.value;
    if (newComment.length <= maxCommentLength) {
      setCommentBody(newComment);
      setTooltipVisible(false);
    } else {
      setTooltipVisible(true);
    }
  };

  const changeEditComment = (e) => {
    var newEditComment = e.target.value;
    if (newEditComment.length <= maxCommentLength) {
      setEditCommentBody(newEditComment);
      setTooltipVisible(false);
    } else {
      setTooltipVisible(true);
    }
  };

  const cancelEdit = () => {
    setCommentToEdit({});
    setIsEditingComment(false);
  };

  const validate = () => {
    var cb = commentBody;
    if (isEditingComment) cb = editCommentBody;
    if (cb.length >= minCommentLength && cb.length <= maxCommentLength)
      return true;
    setTooltipVisible(true);
    return false;
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (validate()) {
      let comment = {};
      if (isEditingComment) {
        comment = {
          commentId: commentToEdit.commentId,
          content: editCommentBody,
          commentedByUserId: userDetails.idTokenClaims.oid,
          commentedOnBugId: selectedBugId,
        };
        console.log("updated", comment);
        const apiObj = await createAuthenticatedEndPoint(
          instance,
          accounts,
          RESTRICTEDENDPOINTS.COMMENT
        );
        let result = apiObj.update(comment.commentId, comment);
        result
          .then((res) => {
            setCommentToEdit({});
            setIsEditingComment(false);
            setEditCommentBody("");
            let index = selectedBug.comments.findIndex(
              (comm) => comm.commentId == comment.commentId
            );
            let newComments = selectedBug.comments;
            newComments[index].content = editCommentBody;
            setSelectedBug({ ...selectedBug, comments: newComments });
          })
          .catch((err) => console.log(err));
      } else {
        //Non edited comment
        comment = {
          commentId: "0",
          content: commentBody,
          commentedByUserId: userDetails.idTokenClaims.oid,
          commentedOnBugId: selectedBugId,
        };
        const apiObj = await createAuthenticatedEndPoint(
          instance,
          accounts,
          RESTRICTEDENDPOINTS.COMMENT
        );
        let result = apiObj.create(comment);
        result
          .then((res) => {
            let data = res.data;
            let prevComments = selectedBug.comments;
            let newComment = data;
            newComment.commentedByUser = currentUser;
            if (prevComments === null) {
              let newComments = [newComment];
              setSelectedBug({ ...selectedBug, comments: newComments });
            } else {
              let newComments = [...selectedBug.comments, newComment];
              setSelectedBug({ ...selectedBug, comments: newComments });
            }
            setCommentBody("");
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <Form
      onFocus={() => setInputFocused(true)}
      className={classes.root}
      onSubmit={(e) => submitComment(e)}
    >
      <Typography gutterBottom>Comments:</Typography>
      <Paper ref={ref}>
        <Tooltip
          title="Character length should be within 4-300"
          placement="top"
          open={tooltipVisible && inputFocused}
        >
          <TextField
            id="comment"
            label={
              isEditingComment
                ? "Edit Your Comment"
                : commentBody
                ? "Unsaved changes"
                : "Enter Your Comment"
            }
            variant="filled"
            color="primary"
            margin="none"
            size="small"
            value={isEditingComment ? editCommentBody : commentBody}
            onFocus={() => setInputFocused(true)}
            onChange={(e) =>
              isEditingComment ? changeEditComment(e) : changeComment(e)
            }
            multiline
            rows={1}
            fullWidth
          />
        </Tooltip>
        {inputFocused ? (
          <>
            <Button
              className={classes.submitButton}
              variant="text"
              type="submit"
            >
              {isEditingComment ? "Update" : "Post"}
            </Button>
            {isEditingComment ? (
              <Button onClick={() => cancelEdit()} variant="text" type="submit">
                Cancel
              </Button>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </Paper>
    </Form>
  );
};

export default BugPostComment;
