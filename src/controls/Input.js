import React from "react";
import TextField from "@material-ui/core/TextField";
import { Fade, Grow, makeStyles } from "@material-ui/core";

const Input = (props) => {
  const {
    name,
    label,
    value,
    variant = "filled",
    onChange,
    error = null,
    ...other
  } = props;

  return (
    <TextField
      variant={variant ? variant : "outlined"}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
};

export default Input;
