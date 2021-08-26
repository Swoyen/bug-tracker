import { Button, makeStyles } from "@material-ui/core";
import { ButtonGroup, Grid } from "@material-ui/core";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DoneTwoToneIcon from "@material-ui/icons/DoneTwoTone";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getShownBug,
  getToggled,
  modifyBug,
  removeBug,
  toggleBugDeleteShown,
  toggleBugEdit,
} from "../../../store/bug";

const useStyles = makeStyles((theme) => ({
  actionButtonGroup: { marginBottom: "10px" },
  editButton: { background: "#0081A7" },
  doneButton: { background: "#06D6A0" },
  deleteButton: { background: "#C05746" },
}));

const BugDetailsButtonGroup = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const canEdit = useSelector(getToggled);
  const { id, tempDesc, tempTitle, loadedBug } = useSelector(getShownBug);

  const handleDone = () => {
    dispatch(toggleBugEdit());
    if (
      tempDesc !== loadedBug.bugDescription ||
      tempTitle !== loadedBug.bugName
    ) {
      let modifiedBug = {
        ...loadedBug,
        bugDescription: tempDesc,
        bugName: tempTitle,
      };
      dispatch(modifyBug(id, modifiedBug));
    }
    console.log("tempDesc", tempDesc);
  };

  const handleEdit = () => {
    dispatch(toggleBugEdit());
  };

  const handleDelete = () => {
    dispatch(toggleBugDeleteShown());
  };

  return (
    <Grid item xs={2}>
      <ButtonGroup
        className={classes.actionButtonGroup}
        variant="text"
        color="default"
        aria-label=""
      >
        {canEdit ? (
          <Button className={classes.doneButton} onClick={() => handleDone()}>
            <DoneTwoToneIcon />
          </Button>
        ) : (
          <Button className={classes.editButton} onClick={() => handleEdit()}>
            <EditTwoToneIcon />
          </Button>
        )}

        <Button className={classes.deleteButton} onClick={() => handleDelete()}>
          <DeleteTwoToneIcon />
        </Button>
      </ButtonGroup>
    </Grid>
  );
};

export default BugDetailsButtonGroup;
