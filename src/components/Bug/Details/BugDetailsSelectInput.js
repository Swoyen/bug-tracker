import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Select from "../../../controls/Select";

const BugDetailsSelectInput = (props) => {
  const {
    title,
    label,
    name,
    value,
    onChange,
    canEdit,
    first,
    second,
    options,
  } = props;

  return (
    <Grid item container xs={12}>
      <Grid item xs={6}>
        <Typography variant="subtitle2">{title}</Typography>
      </Grid>
      <Grid item xs={6}>
        {canEdit ? (
          <Select
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            options={options}
            first={first}
            second={second}
          ></Select>
        ) : (
          <Typography variant="body2">{value}</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default BugDetailsSelectInput;
