import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../controls/Button";
import { setBugResolveShown } from "../../../store/bug";
import BugDetailsButtonGroup from "./BugDetailsButtonGroup";
import BugDetailsProperties from "./BugDetailsProperties";

import DoneOutlineRoundedIcon from "@material-ui/icons/DoneOutlineRounded";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    maxHeight: "300px",
  },
  resolveButton: {
    background: theme.palette.success.light,
  },
}));

const BugDetailsActionProperties = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const handleResolve = () => {
    dispatch(setBugResolveShown(true));
  };

  const handleUnresolve = () => {
    dispatch(setBugResolveShown(true));
  };

  const { loadedBug } = useSelector((state) => state.entities.bug);
  return (
    <Grid
      className={classes.root}
      item
      container
      xs={5}
      spacing={2}
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Grid
        item
        container
        xs={12}
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
      >
        <Grid
          container
          item
          xs
          alignItems="center"
          alignContent="center"
          direction="row-reverse"
          justifyContent="flex-start"
        >
          {loadedBug.resolved ? (
            <Button
              onClick={() => handleUnresolve()}
              startIcon={<DoneOutlineRoundedIcon />}
              color="primary"
            >
              Re-Track
            </Button>
          ) : (
            <Grid item container justifyContent="space-between">
              <Grid item>
                <Button
                  onClick={() => handleResolve()}
                  startIcon={<DoneOutlineRoundedIcon />}
                  className={classes.resolveButton}
                  variant="contained"
                >
                  Mark as Resolved
                </Button>
              </Grid>
              <Grid item>
                <BugDetailsButtonGroup />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid
          className={classes.button}
          item
          xs={12}
          container
          justifyContent="flex-end"
        ></Grid>
      </Grid>

      <BugDetailsProperties />
    </Grid>
  );
};

export default BugDetailsActionProperties;
