import {
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  Input,
  MenuItem,
  Select as MuiSelect,
  Grow,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "12px",
    marginTop: "0px",
    fontSize: "1",
    margin: "0px",
  },
  input: {
    fontSize: 14,
    background: "#E8E8E8",
    paddingLeft: "5px",
    paddingTop: "5px",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
  },
}));

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

  const classes = useStyles();
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
    <Grow in style={{ transformOrigin: "0 0 0" }}>
      <FormControl
        className={`${classes.root} ${classes.noLabel}`}
        margin="dense"
        fullWidth
        variant={variant || "filled"}
        {...(error && { error: true })}
      >
        <MuiSelect
          displayEmpty
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          MenuProps={MenuProps}
          input={<Input className={classes.input} />}
          inputProps={{ "aria-label": "Without label" }}
        >
          {options
            ? options.map((item) => (
                <MenuItem dense key={item[first]} value={item[second]}>
                  {item[second]}
                </MenuItem>
              ))
            : ""}
        </MuiSelect>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Grow>
  );
};

export default Select;
