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
import { TimeContext } from "../../../context/TimeContext";
import AlarmOnTwoToneIcon from "@material-ui/icons/AlarmOnTwoTone";
import TimeChipArray from "./TimeChipArray";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#c1c1c1",
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      background: theme.palette.primary.light,
    },
  },
  actionButton: {
    margin: "none",
    "& *": { padding: "none" },
  },
  grid: {
    minHeight: "60px",
  },
  alarmIcon: {
    marginTop: 2,
    paddingRight: theme.spacing(1),
  },
  timeDetail: {
    paddingLeft: theme.spacing(1),
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
    setOpenTimeEdit,
    openTimeEdit,
    setTimeTrackIdToEdit,
  } = useContext(TimeContext);

  const [timeDuration, setTimeDuration] = useState("00:00");
  const [actionsShown, setActionsShown] = useState(false);

  useEffect(() => {
    const getFormattedTimeFromSeconds = (totalSeconds) => {
      let hours = totalSeconds / 3600;
      let minutes = totalSeconds / 60;
      let seconds = totalSeconds % 60;
      let t = new Date(1970, 0, 1);
      t.setHours(hours);
      t.setMinutes(minutes);
      t.setSeconds(seconds);
      return t.toLocaleTimeString();
    };

    let date1 = new Date(time.startTime);
    let date2 = new Date(time.stopTime);
    let diffTime = Math.abs(date2 - date1);
    setTimeDuration(getFormattedTimeFromSeconds(diffTime / 1000));
  }, [time.startTime, time.stopTime]);

  useEffect(() => {
    if (actionsShownId === time.timeTrackId) {
      setActionsShown(true);
    } else {
      setActionsShown(false);
    }
  }, [actionsShownId, time]);

  const toggleActionsShown = () => {
    // if (!actionsShown) {
    //   setActionsShownId(time.timeTrackId);
    //   setActionsShown(true);
    // } else {
    //   setActionsShown(false);
    // }
  };

  const deleteTimeRecord = (timeTrackId) => {
    setTimeTrackIdToDelete(timeTrackId);
    setOpenConfirmation(true);
  };

  const editTimeRecord = (timeTrackId) => {
    setTimeTrackIdToEdit(timeTrackId);
    setOpenTimeEdit(true);
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
          onClick={() => editTimeRecord(time.timeTrackId)}
          container
          xs={time.timeTrackId === actionsShownId && actionsShown ? 10 : 12}
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
        >
          {/* <Grid item sm={1}>
            <Typography>{time.timeTrackId}</Typography>
          </Grid> */}
          <Grid item sm={10} className={classes.timeDetail}>
            {time.bugName ? (
              <>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Typography variant="subtitle2"> {time.bugName}</Typography>
                  </Grid>
                  <Grid item>
                    <TimeChipArray tags={time.bugTags}></TimeChipArray>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Typography variant="subtitle2">+ Add details</Typography>
                </Grid>
                <Grid item>
                  <TimeChipArray tags={time.bugTags}></TimeChipArray>
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item sm={2} container justifyContent="center">
            {/* <AlarmOnTwoToneIcon
              className={classes.alarmIcon}
              color="primary"
              style={{ fontSize: "15px" }}
            ></AlarmOnTwoToneIcon> */}
            <Typography variant="subtitle2" color="initial" align="right">
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
                    <IconButton
                      onClick={() => editTimeRecord(time.timeTrackId)}
                      size="medium"
                      className={classes.actionButton}
                    >
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
