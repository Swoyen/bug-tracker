import { TextField } from "@material-ui/core";
import React from "react";

const TimeEditInput = (props) => {
  const { label } = props;
  return <TextField margin="dense" variant="filled" label={label}></TextField>;
};

export default TimeEditInput;
