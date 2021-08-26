import React from "react";

import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import Button from "../../../controls/Button";

const BugCreateButton = ({ onClick }) => {
  return (
    <Button startIcon={<AddOutlinedIcon />} onClick={onClick}>
      Create
    </Button>
  );
};

export default BugCreateButton;
