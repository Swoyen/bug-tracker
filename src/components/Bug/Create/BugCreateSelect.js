import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Select from "../../../controls/Select";

const BugCreateSelect = (props) => {
  const {
    gridClass,
    title,
    value,
    name,
    label,
    error,
    options,
    first,
    second,
    onChange,
  } = props;
  return (
    <Grid
      className={gridClass}
      item
      container
      xs={10}
      spacing={1}
      alignItems="center"
    >
      <Grid item xs={5}>
        <Typography variant="subtitle2">{title}</Typography>
      </Grid>
      <Grid item xs={7}>
        <Select
          variant="outlined"
          name={name}
          label={label}
          value={value}
          onChange={onChange}
          error={error}
          options={options}
          first={first}
          second={second}
        ></Select>
      </Grid>
    </Grid>
  );
};

export default BugCreateSelect;
