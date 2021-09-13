import {
  Checkbox,
  Fade,
  IconButton,
  Input,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core/";
import {
  modifyCheckListItem,
  removeCheckListItem,
  toggleCheckListItem,
} from "../../../../store/checklist";
import Form from "../../../../layouts/Form";

const BugCheckListItem = ({ item, bugId }) => {
  const dispatch = useDispatch();
  const labelId = `checkbox-list-label-${item.checkListItemId}`;
  const [actionsVisible, setActionsVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [errors, setErrors] = useState({});

  const handleToggle = (item) => {
    if (!editing) dispatch(toggleCheckListItem(item, bugId));
  };
  const handleDelete = (item) => {
    dispatch(removeCheckListItem(item, bugId));
  };

  const handleEdit = (item) => {
    setEditing(true);
    setEditingText(item.description);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditConfirm();
  };
  const handleEditConfirm = () => {
    if (validate()) {
      var newItem = { ...item, description: editingText };
      setEditing(false);
      dispatch(modifyCheckListItem(newItem));
    }
  };

  const handleEditChange = (e) => {
    setEditingText(e.target.value);
    //validate();
  };

  const validate = () => {
    let temp = {};
    temp.description =
      editingText === "" ? "Description must not be empty!" : "";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const handleActionsShow = () => {
    if (!actionsVisible) setActionsVisible(true);
  };

  return (
    <ListItem
      role={undefined}
      dense
      button
      onClick={() => handleToggle(item)}
      onMouseOver={handleActionsShow}
      onMouseLeave={() => setActionsVisible(false)}
      style={{
        paddingTop: "0px",
        paddingBottom: "0px",
        textDecoration: item.completed ? "line-through" : "none",
      }}
    >
      <ListItemIcon>
        <Checkbox
          color="primary"
          edge="start"
          checked={item.completed}
          tabIndex={-1}
          disableRipple
          inputProps={{ "aria-labelledby": labelId }}
        />
      </ListItemIcon>
      {!editing ? (
        <ListItemText id={labelId} primary={item.description} />
      ) : (
        <Form onSubmit={handleSubmit}>
          <Input
            fullWidth
            autoFocus={true}
            value={editingText}
            onChange={handleEditChange}
          ></Input>
          {errors.description && errors.description !== "" ? "error" : ""}
        </Form>
      )}
      <ListItemSecondaryAction
        onMouseOver={handleActionsShow}
        onMouseLeave={() => setActionsVisible(false)}
      >
        {!editing ? (
          <Fade in={actionsVisible && !editing}>
            <Grid container>
              <IconButton
                aria-label="comments"
                onClick={() => handleDelete(item)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label="comments"
                onClick={() => handleEdit(item)}
              >
                <EditIcon />
              </IconButton>
            </Grid>
          </Fade>
        ) : (
          <Fade in={editing}>
            <IconButton aria-label="comments" onClick={handleEditConfirm}>
              <DoneIcon />
            </IconButton>
          </Fade>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default BugCheckListItem;
