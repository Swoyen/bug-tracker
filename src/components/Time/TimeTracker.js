import React, { useEffect, useState, useContext } from "react";
import PlayRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import StopRoundedIcon from "@material-ui/icons/StopRounded";
import {
  IconButton,
  makeStyles,
  Grid,
  Paper,
  Button,
  Collapse,
} from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Form from "../../layouts/Form";
import { UserContext } from "../../context/UserContext";
import RichTextFieldEditor from "../../controls/RichTextFieldEditor";
import TimeBugSelectWithEmpty from "./TimeEdit/TimeBugSelectWithEmpty";
import TimeBugTagSelect from "./TimeBugTagSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  getStartedTimeTrack,
  getTimeTrackIdAndStarted,
  startTimeTrack,
  stopTimeTrack,
} from "../../store/timeTrack";

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

const TimeTracker = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { timeTrackId: id, started } = useSelector(getTimeTrackIdAndStarted);
  const startedTimeTrack = useSelector(getStartedTimeTrack);

  const [startTimeInSeconds, setStartTimeinSeconds] = useState(null);

  const [timeTrackId, setTimeTrackId] = useState(emptyTimeTrackId);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [timerVariable, setTimerVariable] = useState(null);
  const [formattedElapsedTime, setFormattedElapsedTime] =
    useState(defaultElapsedTime);

  const [formattedJsonDescription, setFormattedJsonDescription] = useState("");
  const [loadedJsonDescription, setLoadedJsonDescription] = useState("");
  const [formattedJsonDefaultValue, setFormattedJsonDefaultValue] =
    useState(null);
  const [clearDesc, setClearDesc] = useState(false);

  const [selectedBugId, setSelectedBugId] = useState(emptyBugId);
  const { currentUser } = useContext(UserContext);

  const [selectedTagValues, setSelectedTagValues] = useState([]);
  const [descriptionShown, setDescriptionShown] = useState(false);

  useEffect(() => {
    if (started && startedTimeTrack) {
      setStartTimeinSeconds(startedTimeTrack.startSeconds);
      let bugId = startedTimeTrack.bugId === null ? -1 : startedTimeTrack.bugId;
      setSelectedBugId(bugId);
      setTimeTrackId(startedTimeTrack.timeTrackId);

      setIsTimerStarted(true);
      setSelectedTagValues(startedTimeTrack.bugTags);
      setLoadedJsonDescription(startedTimeTrack.description);
    } else {
      setStartTimeinSeconds(null);
      setFormattedElapsedTime(defaultElapsedTime);
      setIsTimerStarted(false);
      setSelectedBugId(-1);
      setTimeTrackId(-1);
      setSelectedTagValues([]);
      setLoadedJsonDescription("");
    }
  }, [started, id, startedTimeTrack]);

  useEffect(() => {
    if (loadedJsonDescription) {
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
    // let currentTime = new Date(currentTimeinSeconds);
    let currentTimeIso = new Date().toISOString();
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

    dispatch(startTimeTrack(timeTrack));
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
      bugId: selectedBugId !== -1 ? selectedBugId : null,
      userId: currentUser.userId,
      description: formattedJsonDescription,
      bugTags: ttbt,
      stop: true,
    };

    dispatch(stopTimeTrack(timeTrack.timeTrackId, timeTrack));
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

            <Collapse in={descriptionShown}>
              <div className={classes.textEditorContainer}>
                <RichTextFieldEditor
                  setContent={setFormattedJsonDescription}
                  clear={clearDesc}
                  setClear={setClearDesc}
                  defaultValue={formattedJsonDefaultValue}
                ></RichTextFieldEditor>
              </div>
            </Collapse>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </Form>
    </Paper>
  );
};

export default TimeTracker;
