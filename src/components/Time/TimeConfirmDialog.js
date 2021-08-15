import React from "react";
import { useContext } from "react";
import { TimeContext } from "../../context/TimeContext";
import Dialog from "../../layouts/Dialog";

const TimeConfirmDialog = (props) => {
  const { openConfirmation, setOpenConfirmation, deleteTimeRecord } = props;
  return (
    <Dialog
      title="Confirm Delete"
      openDialog={openConfirmation}
      setOpenDialog={setOpenConfirmation}
      onConfirm={() => deleteTimeRecord()}
    >
      Are you sure you want to delete this record?
    </Dialog>
  );
};

export default TimeConfirmDialog;
