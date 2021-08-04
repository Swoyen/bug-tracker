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
  createAuthenticatedEndPoint,
  createRestrictedAPIEndPoint,
  ENDPOINTS,
  RESTRICTEDENDPOINTS,
} from "../../api";
import Form from "../../layouts/Form";
import { UserContext } from "../../context/UserContext";
import RichTextFieldEditor from "../../controls/RichTextFieldEditor";
import { TrendingUpOutlined } from "@material-ui/icons";
import { TimeContext } from "../../context/TimeContext";
import { useMsal } from "@azure/msal-react";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
  },
  iconButton: {
    background: "yellow",
  },
  textEditorGrid: {},
  textEditorContainer: {
    padding: "10px",
    height: "200px",
    maxHeight: "500px",
    overflow: "auto",
    border: "1px solid " + theme.palette.primary.light,
    borderRadius: "10px",
  },
  textEditor: {
    margin: theme.spacing(2),
  },
}));

let emptyBug = { bugId: "-1", bugName: "Select a bug" };
let defaultElapsedTime = "00:00:00";
let emptyTimeTrackId = -1;
let emptyBugId = -1;

const TimeTracker = (props) => {
  const classes = useStyles();
  const { timeList, setTimeList } = useContext(TimeContext);
  const [startTimeInSeconds, setStartTimeinSeconds] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(null);

  const [timeTrackId, setTimeTrackId] = useState(emptyTimeTrackId);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [timerVariable, setTimerVariable] = useState(null);
  const [formattedElapsedTime, setFormattedElapsedTime] =
    useState(defaultElapsedTime);

  const [formattedJsonDescription, setFormattedJsonDescription] = useState({});
  const [loadedJsonDescription, setLoadedJsonDescription] = useState(null);
  const [formattedJsonDefaultValue, setFormattedJsonDefaultValue] =
    useState(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [clearDesc, setClearDesc] = useState(false);

  const [selectedBugId, setSelectedBugId] = useState(emptyBugId);
  const { currentUser } = useContext(UserContext);
  const { bugList, setBugList } = useContext(BugContext);
  const [bugListWithEmptyBug, setBugListWithEmptyBug] = useState([emptyBug]);
  const [isLoadedTimer, setIsLoadedTimer] = useState(false);

  const { instance, accounts } = useMsal();

  let t = new Date(1970, 0, 1);
  let epoch = new Date(1970, 0, 1);

  useEffect(() => {
    if (timeList) {
      let timers = timeList;
      var startedTimer = timers.find((timer) => timer.stop === false);

      if (startedTimer) {
        setIsLoadedTimer(true);
        setStartTimeinSeconds(startedTimer.startSeconds);
        console.log(startedTimer);
        let bugId = startedTimer.bugId === null ? "-1" : startedTimer.bugId;
        setSelectedBugId(bugId);
        setTimeTrackId(startedTimer.timeTrackId);
        setIsTimerStarted(true);
        // console.log(startedTimer.description);
        setLoadedJsonDescription(startedTimer.description);
      }
    }
  }, [timeList]);

  useEffect(() => {
    if (loadedJsonDescription) {
      // console.log(loadedJsonDescription);
      setFormattedJsonDefaultValue(loadedJsonDescription);
    }
  }, [loadedJsonDescription]);

  useEffect(() => {
    setBugListWithEmptyBug([emptyBug, ...bugList]);

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

  const startTimer = async () => {
    let currentTimeinSeconds = Date.now();
    let currentTime = new Date(currentTimeinSeconds);
    let currentTimeIso = currentTime.toISOString();

    setStartTimeinSeconds(currentTimeinSeconds);

    let timeTrack = {
      timeTrackId: "0",
      startTime: currentTimeIso,
      // stopTime: currentTimeIso
      startSeconds: currentTimeinSeconds,
      userId: currentUser.userId,
      description: formattedJsonDescription,
      bugId: selectedBugId === emptyBugId ? null : selectedBugId,
    };

    (
      await createAuthenticatedEndPoint(
        instance,
        accounts,
        RESTRICTEDENDPOINTS.TIMER
      )
    )
      .create(timeTrack)
      .then((res) => {
        setTimeTrackId(res.data.timeTrackId);
        setIsTimerStarted(true);
      })
      .catch((err) => console.log(err));
  };

  const stopTimer = async () => {
    let currentTimeInSeconds = Date.now();
    let currentTime = new Date(currentTimeInSeconds);
    let stopTimeIso = currentTime.toISOString();
    let startTimeIso = new Date(startTimeInSeconds).toISOString();

    let timeTrack = {
      timeTrackId: timeTrackId,
      startTime: startTimeIso,
      stopTime: stopTimeIso,
      bugId: selectedBugId == -1 ? null : selectedBugId,
      userId: currentUser.userId,
      description: formattedJsonDescription,
      stop: true,
    };

    (
      await createAuthenticatedEndPoint(
        instance,
        accounts,
        RESTRICTEDENDPOINTS.TIMER
      )
    )
      .update(timeTrackId, timeTrack)
      .then((res) => {
        setFormattedElapsedTime(defaultElapsedTime);
        setClearDesc(true);
        setSelectedBugId(emptyBugId);
        setToolbarVisible(false);
        if (!isLoadedTimer) {
          setTimeList([...timeList, timeTrack]);
        } else {
          setIsLoadedTimer(false);
          let index = timeList.findIndex(
            (time) => time.timeTrackId === timeTrack.timeTrackId
          );
          var temp = timeList;
          temp[index] = timeTrack;
          setTimeList([...temp]);
        }
      });
    setIsTimerStarted(false);

    // createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.TIMER)
    //   .update(timeTrackId, timeTrack)
    //   .then((res) => {
    //     setFormattedElapsedTime(defaultElapsedTime);
    //     setClearDesc(true);
    //     setSelectedBugId(emptyBugId);
    //     setToolbarVisible(false);
    //     setTimeList([...timeList, timeTrack]);
    //   });
    // setIsTimerStarted(false);
  };

  return (
    <div className={classes.root}>
      <Typography gutterBottom variant="h4" color="initial">
        Track Time
      </Typography>
      <Form>
        <Grid
          alignItems="flex-start"
          justifyContent="space-between"
          container
          spacing={1}
        >
          <Grid item container xs={8} spacing={1}>
            <Grid item xs={12}>
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
            <Grid item xs={12} className={classes.textEditorGrid}>
              <div
                style={{
                  height: toolbarVisible ? "200px" : "100px",
                  background: "yellow",
                }}
                onFocus={() => setToolbarVisible(true)}
                className={classes.textEditorContainer}
              >
                <RichTextFieldEditor
                  setContent={setFormattedJsonDescription}
                  clear={clearDesc}
                  setClear={setClearDesc}
                  defaultValue={formattedJsonDefaultValue}
                ></RichTextFieldEditor>
              </div>
            </Grid>
          </Grid>

          <Grid
            item
            justifyContent="flex-end"
            alignItems="center"
            container
            xs={4}
          >
            <Grid item xs={10}>
              <Typography align="right" variant="h6">
                {formattedElapsedTime}
              </Typography>
            </Grid>
            <Grid item xs={2}>
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
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Form>
    </div>
  );
};

export default TimeTracker;
