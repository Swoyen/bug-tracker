import { makeStyles, useTheme } from "@material-ui/core";
import React from "react";
import Popup from "../../../layouts/Popup";
import Dialog from "../../../layouts/Dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getBugDeleteToggled,
  getShownBug,
  hideBug,
  removeBug,
  setTempTitle,
  toggleBugDeleteShown,
} from "../../../store/bug";
import { useState, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const BugDetailsPopup = (props) => {
  const { id, shown, editable: canEdit, loadedBug } = useSelector(getShownBug);

  const [bugTitle, setBugTitle] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const bugDeleteConfirm = useSelector(getBugDeleteToggled);

  useEffect(() => {
    if (shown) setBugTitle(loadedBug.bugName);
  }, [shown, loadedBug.bugName]);

  useEffect(() => {
    dispatch(setTempTitle(bugTitle));
  }, [bugTitle]);

  const handleClose = () => {
    dispatch(hideBug());
  };

  const handleDelete = async () => {
    dispatch(removeBug(id));
  };

  return (
    <Popup
      minWidth="1000px"
      minHeight="400px"
      class={classes.root}
      title={bugTitle}
      setTitle={setBugTitle}
      editTitle={canEdit}
      openPopup={shown}
      closePopup={handleClose}
      center={false}
      topMargin={theme.spacing(10)}
    >
      {props.children}
      <Dialog
        title="Confirm Delete"
        openDialog={bugDeleteConfirm}
        setOpenDialog={() => dispatch(toggleBugDeleteShown())}
        onConfirm={() => handleDelete()}
      >
        Are you sure you want to delete this record?
      </Dialog>
    </Popup>
  );
};

export default BugDetailsPopup;
