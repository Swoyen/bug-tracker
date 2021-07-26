import React, { useEffect, useState, useContext } from "react";
import PlayRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import PauseRoundedIcon from "@material-ui/icons/PauseRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import { IconButton, makeStyles, Grid } from "@material-ui/core";
import { BugContext } from "../../context/BugContext";
import {
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Typography,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@material-ui/core";
import {
  createAPIEndPoint,
  createRestrictedAPIEndPoint,
  ENDPOINTS,
  RESTRICTEDENDPOINTS,
} from "../../api";
import Form from "../../layouts/Form";
import { UserContext } from "../../context/UserContext";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
  },
  iconButton: {
    background: "yellow",
  },
}));

let emptyBug = { bugId: "-1", bugName: "Select a bug" };
const TimeTracker = (props) => {
  const classes = useStyles();
  const { timeList } = props;
  const [startTimeInSeconds, setStartTimeinSeconds] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(null);

  const [timeTrackId, setTimeTrackId] = useState("-1");
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [timerVariable, setTimerVariable] = useState(null);
  const [formattedElapsedTime, setFormattedElapsedTime] = useState("00:00:00");

  const [selectedBugId, setSelectedBugId] = useState(-1);
  const { userDetails } = useContext(UserContext);
  const { bugList, setBugList } = useContext(BugContext);
  const [bugListWithEmptyBug, setBugListWithEmptyBug] = useState([emptyBug]);

  let t = new Date(1970, 0, 1);
  let epoch = new Date(1970, 0, 1);

  useEffect(() => {
    if (timeList) {
      let timers = timeList;
      var startedTimer = timers.find((timer) => timer.stop === false);
      if (startedTimer) {
        setStartTimeinSeconds(startedTimer.startSeconds);
        setSelectedBugId(startedTimer.bugId);
        setTimeTrackId(startedTimer.timeTrackId);
        setIsTimerStarted(true);
      }
    }
  }, [timeList]);

  useEffect(() => {
    if (bugList.length === 0) {
      createAPIEndPoint(ENDPOINTS.BUG)
        .fetchAll()
        .then((res) => {
          let data = res.data;
          setBugList(data);
        })
        .catch((err) => console.log(err));
    } else {
      setBugListWithEmptyBug([emptyBug, ...bugList]);
    }
    return () => {
      setBugListWithEmptyBug([emptyBug]);
    };
  }, [bugList]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (isTimerStarted) {
        setElapsedSeconds(0);
        setFormattedElapsedTime(getFormattedTimeFromSeconds(0));
        setTimerVariable(
          setInterval(() => {
            if (mounted) {
              let offset = Date.now() - startTimeInSeconds;
              // console.log(offset);
              let seconds = offset / 1000;
              setElapsedSeconds(seconds);
              setFormattedElapsedTime(getFormattedTimeFromSeconds(seconds));
            }
          }, 1000)
        );
      } else {
        clearInterval(timerVariable);
      }
      return () => {
        mounted = false;
      };
    }
  }, [isTimerStarted]);

  const getFormattedTimeFromSeconds = (totalSeconds) => {
    let hours = totalSeconds / 3600;
    let minutes = totalSeconds / 60;
    let seconds = totalSeconds % 60;
    t.setHours(hours);
    t.setMinutes(minutes);
    t.setSeconds(seconds);
    return t.toLocaleTimeString();
  };

  const startTimer = () => {
    let currentTimeinSeconds = Date.now();
    let currentTime = new Date(currentTimeinSeconds);
    let currentTimeIso = currentTime.toISOString();

    setStartTimeinSeconds(currentTimeinSeconds);

    let timeTrack = {
      timeTrackId: "0",
      startTime: currentTimeIso,
      // stopTime: currentTimeIso
      startSeconds: currentTimeinSeconds,
      userId: userDetails.userId,
      bugId: selectedBugId,
    };
    console.log(timeTrack);
    createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.TIMER)
      .create(timeTrack)
      .then((res) => {
        setTimeTrackId(res.data.timeTrackId);
        setIsTimerStarted(true);
      })
      .catch((err) => console.log(err));
  };

  const stopTimer = () => {
    let currentTimeInSeconds = Date.now();
    let currentTime = new Date(currentTimeInSeconds);
    let stopTimeIso = currentTime.toISOString();
    let startTimeIso = new Date(startTimeInSeconds).toISOString();

    let timeTrack = {
      timeTrackId: timeTrackId,
      startTime: startTimeIso,
      stopTime: stopTimeIso,
      bugId: selectedBugId,
      userId: userDetails.userId,
      stop: true,
    };

    console.log(timeTrack);
    createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.TIMER)
      .update(timeTrackId, timeTrack)
      .then((res) => console.log(res));
    setIsTimerStarted(false);
  };

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" color="initial">
        Track Time
      </Typography>
      <Form>
        <Grid alignItems="center" container spacing={1}>
          <Grid item xs={6}>
            <InputLabel id="bug">Bug</InputLabel>
            <Select labelId="label" id="bug" value={selectedBugId}>
              {bugListWithEmptyBug.map((bug) => {
                return (
                  <MenuItem
                    disabled={bug.bugId === "-1" ? true : false}
                    key={bug.bugId}
                    value={bug.bugId}
                    onClick={() => setSelectedBugId(bug.bugId)}
                  >
                    {bug.bugName}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={5}>
            <Typography align="right" variant="h6">
              {formattedElapsedTime}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {isTimerStarted ? (
              <IconButton
                onClick={() => stopTimer()}
                className={classes.iconButton}
                fontSize="small"
              >
                <StopRoundedIcon fontSize="medium"></StopRoundedIcon>
              </IconButton>
            ) : (
              <IconButton
                onClick={() => startTimer()}
                className={classes.iconButton}
                fontSize="small"
              >
                <PlayRoundedIcon fontSize="medium"></PlayRoundedIcon>
              </IconButton>
            )}
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Form>
    </div>
  );
};

export default TimeTracker;
