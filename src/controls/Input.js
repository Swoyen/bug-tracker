import React from "react";
import TextField from "@material-ui/core/TextField";

const Input = (props) => {
  const {
    name,
    label,
    value,
    variant = null,
    onChange,
    error = null,
    ...other
  } = props;
  return (
    <TextField
      variant={variant ? variant : "outined"}
      label={label}
      name={name}
      value={value}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
};

export default Input;
