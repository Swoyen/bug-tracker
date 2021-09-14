import { Button, Grid } from "@material-ui/core";
import React from "react";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  attachFile,
  removeAttachment,
  setBugAttachmentDeleteShown,
} from "../../../../store/bug";
import { enqueueErrorSnackbar } from "../../../../store/notifier";
import BugAttachFileList from "./BugAttachFileList";
import Dialog from "../../../../layouts/Dialog";
import { useTheme } from "@material-ui/styles";

const BugAttachFile = () => {
  const fileInput = useRef(null);
  const dispatch = useDispatch();
  const theme = useTheme();

  const userId = useSelector((state) => state.entities.auth.userId);
  const bugId = useSelector((state) => state.entities.bug.loadedBug.bugId);
  const deleteVisible = useSelector(
    (state) => state.entities.bug.attachmentDeleteShown
  );
  const attachmentId = useSelector(
    (state) => state.entities.bug.attachmentDeleteId
  );

  const resolved = useSelector(
    (state) => state.entities.bug.loadedBug.resolved
  );

  const fileSizeLimitInKb = 500000;
  const fileSizeLimitInMb = fileSizeLimitInKb / 1000;

  const handleAttach = (e) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        let name = file.name;
        const currentTime = new Date().toISOString();
        console.log(currentTime);
        const formData = new FormData();
        formData.append("attachmentId", 0);
        formData.append("name", name);
        formData.append("file", file);
        formData.append("attachedDate", currentTime);
        formData.append("userId", userId);
        formData.append("bugId", bugId);
        const fileSizeInKb = file.size / 1000;
        console.log(fileSizeInKb < fileSizeLimitInKb);
        if (fileSizeInKb < fileSizeLimitInKb) {
          dispatch(attachFile(formData));
        } else {
          dispatch(
            enqueueErrorSnackbar(
              `File size is greater than limit(${fileSizeLimitInMb}Mb)`
            )
          );
        }
      };
      reader.readAsDataURL(file);
    } else {
      dispatch(enqueueErrorSnackbar(`Error uploading)`));
    }
  };

  const handleDeleteConfirm = () => {
    dispatch(removeAttachment(attachmentId));
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInput}
        onChange={handleAttach}
        accept="."
      ></input>

      <Grid container spacing={1}>
        {!resolved ? (
          <Grid item xs={12}>
            <Button
              startIcon={<AttachFileRoundedIcon />}
              variant="outlined"
              color="primary"
              onClick={() => fileInput.current.click()}
            >
              Attach File
            </Button>
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs={12} style={{ marginTop: theme.spacing(1) }}>
          <BugAttachFileList />
        </Grid>
      </Grid>
      <Dialog
        title="Confirm Delete"
        openDialog={deleteVisible}
        setOpenDialog={() => dispatch(setBugAttachmentDeleteShown(false))}
        top="250px"
        onConfirm={() => handleDeleteConfirm()}
      >
        Are you sure you want to delete this attachment?
      </Dialog>
    </>
  );
};

export default BugAttachFile;
