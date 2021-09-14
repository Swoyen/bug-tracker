import { Grow } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { Grid, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import React from "react";
import Input from "../../../controls/Input";
import { getShownBug, getToggled, setTempDesc } from "../../../store/bug";
import { useState, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: { minHeight: "150px", maxHeight: "250px" },
  input: { fontSize: "15px", padding: "0" },
  label: { height: "0px" },
}));

const BugDetailsDescription = () => {
  const classes = useStyles();
  const canEdit = useSelector(getToggled);

  const dispatch = useDispatch();

  const [description, setDescription] = useState("");
  const { loadedBug, shown } = useSelector(getShownBug);

  useEffect(() => {
    if (shown) setDescription(loadedBug.bugDescription);
  }, [loadedBug.bugDescription, shown]);

  useEffect(() => {
    dispatch(setTempDesc(description));
  }, [description, dispatch]);

  return (
    <Grid className={classes.root} item xs={12}>
      <Typography variant="subtitle1">Description:</Typography>
      {canEdit ? (
        <Grow in style={{ transformOrigin: "0 0 0" }}>
          <Input
            className={classes.input}
            InputProps={{
              classes: {
                input: classes.input,
              },
            }}
            fullWidth
            multiline
            rows="5"
            name="description"
            label=""
            variant="filled"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Input>
        </Grow>
      ) : (
        <Typography variant="body2">{description}</Typography>
      )}
    </Grid>
  );
};

export default BugDetailsDescription;
