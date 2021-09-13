import React from "react";
import Form from "../../../../layouts/Form";
import { Grid, Input } from "@material-ui/core";

import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useState } from "react";
import { IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { addCheckListItem } from "../../../../store/checklist";
import { useSelector } from "react-redux";

const BugCheckListInput = ({ checkListId, handleToggleInputVisible }) => {
  const bugId = useSelector((state) => state.entities.bug.loadedBug.bugId);
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");
  const handleAdd = (e) => {
    e.preventDefault();
    if (inputText !== "") {
      var newItem = {
        itemId: 0,
        description: inputText,
        completed: false,
        checkListId: checkListId,
      };

      dispatch(addCheckListItem(newItem, bugId));
      setInputText("");
      handleToggleInputVisible();
    }
  };
  return (
    <Form onSubmit={handleAdd}>
      <Grid container>
        <Grid item>
          <Input
            autoFocus={true}
            placeholder="Enter your text here...."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></Input>
        </Grid>
        <Grid item>
          <IconButton aria-label="Add" type="submit">
            <AddCircleRoundedIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton aria-label="Cancel" onClick={handleToggleInputVisible}>
            <CancelRoundedIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Form>
  );
};

export default BugCheckListInput;
