import React, { useState, useEffect } from "react";

import {
  makeStyles,
  IconButton,
  Paper,
  Grid,
  Typography,
  Grow,
  Tooltip,
} from "@material-ui/core";
import DeleteSweepRoundedIcon from "@material-ui/icons/DeleteSweepRounded";
import EditAttributesRoundedIcon from "@material-ui/icons/EditAttributesRounded";
import { useContext } from "react";
import { TimeContext } from "../../context/TimeContext";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#EEEEEE",
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    cursor: "pointer",
  },
  actionButton: {
    margin: "none",
    "& *": { padding: "none" },
  },
  grid: {
    height: "60px",
  },
}));

const TimePaper = (props) => {
  const classes = useStyles();
  const { time } = props;

  const {
    setOpenConfirmation,
    setTimeTrackIdToDelete,
    actionsShownId,
    setActionsShownId,
  } = useContext(TimeContext);

  const [timeDuration, setTimeDuration] = useState("00:00");
  const [actionsShown, setActionsShown] = useState(false);

  useEffect(() => {
    let date1 = new Date(time.startTime);
    let date2 = new Date(time.stopTime);
    let diffTime = Math.abs(date2 - date1);
    setTimeDuration(getFormattedTimeFromSeconds(diffTime / 1000));
  }, []);

  useEffect(() => {
    if (actionsShownId === time.timeTrackId) {
      setActionsShown(true);
      console.log(time);
    } else {
      setActionsShown(false);
    }
  }, [actionsShownId]);

  let t = new Date(1970, 0, 1);
  const getFormattedTimeFromSeconds = (totalSeconds) => {
    let hours = totalSeconds / 3600;
    let minutes = totalSeconds / 60;
    let seconds = totalSeconds % 60;
    t.setHours(hours);
    t.setMinutes(minutes);
    t.setSeconds(seconds);
    return t.toLocaleTimeString();
  };

  const toggleActionsShown = () => {
    if (!actionsShown) {
      setActionsShownId(time.timeTrackId);
      setActionsShown(true);
    } else {
      setActionsShown(false);
    }
  };

  const deleteTimeRecord = (timeTrackId) => {
    setTimeTrackIdToDelete(timeTrackId);
    setOpenConfirmation(true);
  };

  return (
    <Paper className={classes.root}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
      >
        <Grid
          item
          className={classes.grid}
          onClick={() => toggleActionsShown()}
          container
          xs={time.timeTrackId === actionsShownId && actionsShown ? 10 : 12}
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
        >
          <Grid item>{time.timeTrackId}</Grid>
          <Grid item>
            <Typography variant="subtitle1" color="initial" align="right">
              {timeDuration}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent="space-evenly"
          item
          xs={2}
          alignItems="center"
        >
          {time.timeTrackId === actionsShownId && actionsShown ? (
            <Grow in={time.timeTrackId === actionsShownId && actionsShown}>
              <Grid
                container
                justifyContent="space-evenly"
                item
                xs={12}
                alignItems="center"
              >
                <Grid item>
                  <Tooltip title="Delete Time Record">
                    <IconButton
                      variant="filled"
                      size="medium"
                      className={classes.actionButton}
                      onClick={() => deleteTimeRecord(time.timeTrackId)}
                    >
                      <DeleteSweepRoundedIcon></DeleteSweepRoundedIcon>
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Edit Time Record">
                    <IconButton size="medium" className={classes.actionButton}>
                      <EditAttributesRoundedIcon></EditAttributesRoundedIcon>
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grow>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TimePaper;
