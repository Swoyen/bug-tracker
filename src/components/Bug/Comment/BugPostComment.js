import React, { useContext, useEffect } from "react";

import { TextField, makeStyles, Tooltip, Paper } from "@material-ui/core";

import Button from "../../../controls/Button";
import Form from "../../../layouts/Form";
import { useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  cancelCommentEdit,
  updateComment,
  getEditingComment,
} from "../../../store/comments";
import { getShownBug } from "../../../store/bug";

const maxCommentLength = 300;
const minCommentLength = 4;

const useStyles = makeStyles((theme) => ({
  root: { paddingBottom: theme.spacing(1) },
  submitButton: { marginLeft: "10px" },
}));

const BugPostComment = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { userDetails } = useContext(UserContext);

  const { id: bugId, shown } = useSelector(getShownBug);
  const commentToEdit = useSelector(getEditingComment);

  const [commentBody, setCommentBody] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editCommentBody, setEditCommentBody] = useState("");
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
    if (
      Object.keys(commentToEdit).length !== 0 &&
      commentToEdit.commentId !== -1
    ) {
      setIsEditingComment(true);
      setInputFocused(true);
      setEditCommentBody(commentToEdit.content);
    }
  }, [commentToEdit]);

  useEffect(() => {
    if (shown) {
    } else {
      dispatch(cancelCommentEdit());
    }
  }, [shown, dispatch]);

  const handleChangeComment = (e) => {
    var newComment = e.target.value;
    if (newComment.length <= maxCommentLength) {
      setCommentBody(newComment);
      setTooltipVisible(false);
    } else {
      setTooltipVisible(true);
    }
  };

  const handleChangeEditComment = (e) => {
    var newEditComment = e.target.value;
    if (newEditComment.length <= maxCommentLength) {
      setEditCommentBody(newEditComment);
      setTooltipVisible(false);
    } else {
      setTooltipVisible(true);
    }
  };

  const handleCancelEdit = () => {
    dispatch(cancelCommentEdit());
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      let comment = {};
      if (isEditingComment) {
        comment = {
          commentId: commentToEdit.commentId,
          content: editCommentBody,
          commentedByUserId: userDetails.idTokenClaims.oid,
          commentedOnBugId: bugId,
        };
        const result = dispatch(
          updateComment(commentToEdit.commentId, comment)
        );
        result.then(() => {
          setIsEditingComment(false);
          setEditCommentBody("");
        });
      } else {
        //Non edited comment
        comment = {
          commentId: "0",
          content: commentBody,
          commentedByUserId: userDetails.idTokenClaims.oid,
          commentedOnBugId: bugId,
        };
        dispatch(addComment(comment)).then(() => {
          setCommentBody("");
          setInputFocused(false);
        });
      }
    }
  };

  return (
    <Form
      onFocus={() => setInputFocused(true)}
      className={classes.root}
      onSubmit={(e) => handleSubmit(e)}
    >
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
              isEditingComment
                ? handleChangeEditComment(e)
                : handleChangeComment(e)
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
              <Button
                onClick={() => handleCancelEdit()}
                variant="text"
                type="submit"
              >
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
