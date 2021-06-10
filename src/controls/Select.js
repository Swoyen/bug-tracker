import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@material-ui/core";
import React from "react";

const Select = (props) => {
  const {
    name,
    label,
    value,
    variant,
    onChange,
    options,
    first,
    second,
    error = null,
  } = props;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  };

  return (
    <FormControl
      fullWidth
      variant={variant || "outlined"}
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        MenuProps={MenuProps}
      >
        {options.map((item) => (
          <MenuItem key={item[first]} value={item[second]}>
            {item[second]}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default Select;
