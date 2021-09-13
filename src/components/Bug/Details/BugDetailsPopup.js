import { makeStyles, useTheme } from "@material-ui/core";
import React from "react";
import Popup from "../../../layouts/Popup";
import Dialog from "../../../layouts/Dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getBugDeleteToggled,
  getShownBug,
  hideBug,
  modifyBug,
  removeBug,
  setBugResolveShown,
  setTempTitle,
  toggleBugDeleteShown,
} from "../../../store/bug";
import { useState, useEffect } from "react";
import { resolveBug, unResolveBug } from "../../../store/bugs";
import { removeFromBugStatusList } from "../../../store/board";
import { BASE_URL, RESTRICTEDENDPOINTS } from "../../../api/config";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const BugDetailsPopup = (props) => {
  const { removeFromBoard } = props;
  const { id, shown, editable: canEdit, loadedBug } = useSelector(getShownBug);

  const [bugTitle, setBugTitle] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const bugDeleteConfirm = useSelector(getBugDeleteToggled);
  const bugResolveConfirm = useSelector(
    (state) => state.entities.bug.resolveShown
  );

  useEffect(() => {
    if (shown) setBugTitle(loadedBug.bugName);
  }, [shown, loadedBug.bugName]);

  useEffect(() => {
    if (shown) dispatch(setTempTitle(bugTitle));
  }, [shown, bugTitle]);

  const handleClose = () => {
    dispatch(hideBug());
  };

  const handleDelete = async () => {
    removeFromBoard
      ? dispatch(removeBug(id)).then((res) => {
          console.log(res);
          dispatch(removeFromBugStatusList(res.bugId, res.statusId));
        })
      : dispatch(removeBug(id));
  };

  const handleResolve = () => {
    removeFromBoard
      ? dispatch(resolveBug(id, loadedBug))
          .then

          // dispatch(removeFromBugStatusList(res.bugId, res.statusId))
          ()
      : dispatch(resolveBug(id, loadedBug));
  };

  const handleUnresolve = () => {
    dispatch(unResolveBug(id, loadedBug));
  };

  const handleUnsetImg = () => {
    var newBug = {
      ...loadedBug,
      headerBackgroundSet: false,
      headerBackgroundImgSrc: null,
    };
    dispatch(modifyBug(id, newBug));
  };

  return (
    <Popup
      headerImgSrc={
        loadedBug.headerBackgroundSet &&
        `${BASE_URL}${RESTRICTEDENDPOINTS.IMAGE}/${loadedBug.headerBackgroundImgSrc}`
      }
      handleUnsetImg={handleUnsetImg}
      minWidth="800px"
      minHeight="500px"
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
        title="Confirm Resolve"
        openDialog={bugResolveConfirm}
        setOpenDialog={() => dispatch(setBugResolveShown(false))}
        onConfirm={() =>
          loadedBug.resolved ? handleUnresolve() : handleResolve()
        }
      >
        {loadedBug.resolved
          ? "Are you sure you want to track this issue again?"
          : "Are you sure you want to resolve this issue?"}
      </Dialog>
      <Dialog
        title="Confirm Delete"
        danger={true}
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
