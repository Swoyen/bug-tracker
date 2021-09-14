import { Button } from "@material-ui/core";
import { Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "../../../../layouts/Form";
import {
  getSelectedLabel,
  loadLabels,
  modifySearchTerm,
} from "../../../../store/labels";
import BugDetailsLabelSelectPaper from "./BugDetailsLabelSelectPaper";

const BugDetailsLabelSelectLabel = (props) => {
  const dispatch = useDispatch();

  const searchTerm = useSelector((state) => state.entities.labels.searchTerm);
  const { goNext } = props;
  const labels = useSelector(getSelectedLabel);
  const [currentEditId, setCurrentEditId] = useState(-1);

  useEffect(() => {
    dispatch(loadLabels());
    return () => {
      dispatch(modifySearchTerm(""));
    };
  }, [dispatch]);

  useEffect(() => {
    if (labels.length === 0) setCurrentEditId(-1);
  }, [labels.length]);

  const handleSearchTermModified = (e) => {
    dispatch(modifySearchTerm(e.target.value));
  };

  return (
    <Form>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            autoFocus={true}
            onFocus={() => setCurrentEditId(-1)}
            id="label-text"
            placeholder="Search for label..."
            value={searchTerm}
            onChange={(e) => handleSearchTermModified(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="initial">
            Labels
          </Typography>
        </Grid>
        <Grid
          item
          container
          xs={12}
          style={{ maxHeight: "500px", overflow: "auto" }}
        >
          {labels.map((label) => (
            <BugDetailsLabelSelectPaper
              key={label.labelId}
              label={label}
              currentEditId={currentEditId}
              setCurrentEditId={setCurrentEditId}
            />
          ))}
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth onClick={goNext}>
            Create New Label
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
};

export default BugDetailsLabelSelectLabel;
