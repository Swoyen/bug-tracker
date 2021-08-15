import React, { useEffect, useState, useContext } from "react";
import PlayRoundedIcon from "@material-ui/icons/PlayArrowRounded";
// import PauseRoundedIcon from "@material-ui/icons/PauseRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import {
  IconButton,
  makeStyles,
  Grid,
  Paper,
  Button,
  Collapse,
  Grow,
} from "@material-ui/core";
import { BugContext } from "../../context/BugContext";
import { InputLabel, Select, MenuItem, Typography } from "@material-ui/core";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../api";
import Form from "../../layouts/Form";
import { UserContext } from "../../context/UserContext";
import RichTextFieldEditor from "../../controls/RichTextFieldEditor";
import { TimeContext } from "../../context/TimeContext";
import { useMsal } from "@azure/msal-react";
import TimeBugSelectWithEmpty from "./TimeEdit/TimeBugSelectWithEmpty";
import TimeBugTagSelect from "./TimeBugTagSelect";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "left",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  form: {
    padding: theme.spacing(1),
  },
  iconButton: {
    background: theme.palette.primary.main,
    "&:hover": {
      background: theme.palette.primary.light,
    },
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
  container: {
    display: "flex",
  },
  paper: {
    margin: theme.spacing(1),
  },
  svg: {
    width: 100,
    height: 100,
  },
  polygon: {
    fill: theme.palette.common.white,
    stroke: theme.palette.divider,
    strokeWidth: 1,
  },
}));

// let emptyBug = { bugId: "-1", bugName: "Select a bug" };
let defaultElapsedTime = "00:00:00";
let emptyTimeTrackId = -1;
let emptyBugId = -1;

const TimeTracker = (props) => {
  const classes = useStyles();
  const { timeList, setTimeList, fetchTimeList } = useContext(TimeContext);
  const [startTimeInSeconds, setStartTimeinSeconds] = useState(null);
  // const [elapsedSeconds, setElapsedSeconds] = useState(null);

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
  const { bugList } = useContext(BugContext);
  // const [bugListWithEmptyBug, setBugListWithEmptyBug] = useState([emptyBug]);
  const [isLoadedTimer, setIsLoadedTimer] = useState(false);

  const [selectedTagValues, setSelectedTagValues] = useState([]);
  const [descriptionShown, setDescriptionShown] = useState(false);

  const { instance, accounts } = useMsal();

  // let epoch = new Date(1970, 0, 1);

  useEffect(() => {
    if (timeList) {
      let timers = timeList;
      var startedTimer = timers.find((timer) => timer.stop === false);
      //console.log(timeList);
      if (startedTimer) {
        setIsLoadedTimer(true);
        setStartTimeinSeconds(startedTimer.startSeconds);
        let bugId = startedTimer.bugId === null ? "-1" : startedTimer.bugId;
        setSelectedBugId(bugId);
        setTimeTrackId(startedTimer.timeTrackId);
        setIsTimerStarted(true);
        setSelectedTagValues(startedTimer.bugTags);
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

    let mounted = true;

    // TODO :Fix this
    if (mounted) {
      if (isTimerStarted) {
        // setElapsedSeconds(0);
        setFormattedElapsedTime(getFormattedTimeFromSeconds(0));
        setTimerVariable(
          setInterval(() => {
            if (mounted) {
              let offset = Date.now() - startTimeInSeconds;
              // console.log(offset);
              let seconds = offset / 1000;
              //setElapsedSeconds(seconds);
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
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerStarted]);

  const startTimer = async () => {
    let currentTimeinSeconds = Date.now();
    let currentTime = new Date(currentTimeinSeconds);
    let currentTimeIso = currentTime.toISOString();
    setStartTimeinSeconds(currentTimeinSeconds);
    var tags = [];
    selectedTagValues.forEach((tag) => tags.push({ bugTagId: tag.bugTagId }));

    let timeTrack = {
      timeTrackId: "0",
      startTime: currentTimeIso,
      // stopTime: currentTimeIso
      startSeconds: currentTimeinSeconds,
      userId: currentUser.userId,
      description: formattedJsonDescription,
      bugId: selectedBugId === emptyBugId ? null : selectedBugId,
      bugTags: tags,
    };
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.TIMER
    );
    apiObj
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

    let ttbt = [];
    selectedTagValues.forEach((tag) =>
      ttbt.push({ bugTagId: tag.bugTagId, timeTrackId: timeTrackId })
    );

    let timeTrack = {
      timeTrackId: timeTrackId,
      startTime: startTimeIso,
      stopTime: stopTimeIso,
      bugId: selectedBugId === -1 ? null : selectedBugId,
      userId: currentUser.userId,
      description: formattedJsonDescription,
      bugTags: ttbt,
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
        setSelectedTagValues([]);
        setClearDesc(true);
        setSelectedBugId(emptyBugId);
        setToolbarVisible(false);
        timeTrack.bugName = res.data.bugName;
        if (!isLoadedTimer) {
          fetchTimeList();
          // setTimeList([...timeList, timeTrack]);
        } else {
          setIsLoadedTimer(false);
          let index = timeList.findIndex(
            (time) => time.timeTrackId === timeTrack.timeTrackId
          );
          var temp = timeList;
          temp[index] = timeTrack;
          setTimeList([...temp]);
        }
      })
      .catch((err) => console.log(err));
    setIsTimerStarted(false);
  };

  const toggleDescription = () => {
    setDescriptionShown(!descriptionShown);
  };

  return (
    <Paper className={classes.root}>
      <Typography gutterBottom variant="h5" color="initial">
        TRACK TIME
      </Typography>
      <Form className={classes.form}>
        <Grid
          alignItems="flex-start"
          justifyContent="space-between"
          container
          spacing={1}
        >
          <Grid item container sm={8} spacing={1}>
            <Grid
              item
              container
              xs={12}
              sm={12}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item sm={12} xs={12}>
                <TimeBugSelectWithEmpty
                  selectedBugId={selectedBugId}
                  setSelectedBugId={setSelectedBugId}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TimeBugTagSelect
                  value={selectedTagValues}
                  setValue={setSelectedTagValues}
                ></TimeBugTagSelect>
              </Grid>
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
          <Grid item xs={12} className={classes.textEditorGrid}>
            <Button onClick={toggleDescription}>
              {descriptionShown ? "Hide description" : "Show description"}
            </Button>

            {descriptionShown ? (
              <Grow in={descriptionShown}>
                <div
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
              </Grow>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Form>
    </Paper>
  );
};

export default TimeTracker;
