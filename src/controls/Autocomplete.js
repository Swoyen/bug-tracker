import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";
import { Autocomplete as MuiAutocomplete } from "@material-ui/lab";

const filter = createFilterOptions();

const Autocomplete = (props) => {
  const {
    label,
    id,
    variant = "standard",
    options,
    addOption,
    value,
    setValue,
    title,
  } = props;
  return (
    <>
      {options && value ? (
        <MuiAutocomplete
          multiple
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === "object") {
              if (Array.isArray(newValue)) {
                let [newVal] = newValue.slice(-1);
                if (typeof newValue === "string") {
                  setValue({
                    [title]: newValue,
                  });
                }
                if (newVal && newVal.inputValue) {
                  addOption(newVal.inputValue);
                  // newOption.then((res) =>
                  //   setValue((val) => {
                  //     return [...val, res];
                  //   })
                  // );
                } else {
                  setValue(newValue);
                }
              }
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            // Suggest the creation of a new value
            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                [title]: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id={id}
          options={options}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option[title];
          }}
          getOptionSelected={(option, value) => {
            return option[title] === value[title];
          }}
          renderOption={(option) => option[title]}
          style={{ width: 300 }}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant={variant}
              placeholder="Add Some Tags"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default Autocomplete;
