import React from "react";
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
