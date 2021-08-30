import React, { useState } from "react";
import { Grid, makeStyles, Select, Typography } from "@material-ui/core";
import { FormControl } from "@material-ui/core";

// import {  createFilterOptions } from "@material-ui/lab";
import Autocomplete from "../../controls/Autocomplete";
import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  addTimeTag,
  emptyAddedTimeBugTag,
  loadTimeBugTags,
} from "../../store/timeBugTags";
import { waitUntil, TimeoutError } from "async-wait-until";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const TimeBugTagSelect = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { value, setValue } = props;

  const { list: tags } = useSelector((state) => state.entities.timeBugTags);

  const addTag = async (tagName) => {
    dispatch(addTimeTag(tagName));
  };

  useEffect(() => {
    dispatch(loadTimeBugTags());
  }, [dispatch]);

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <Autocomplete
              label="Tags"
              id="tags"
              options={tags}
              addOption={addTag}
              title="bugTagName"
              value={value}
              setValue={setValue}
            ></Autocomplete>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default TimeBugTagSelect;
