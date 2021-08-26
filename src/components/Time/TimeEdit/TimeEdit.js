import React, { useState, useEffect } from "react";

import Popup from "../../../layouts/Popup";
import Form from "../../../layouts/Form";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Button, Divider, makeStyles } from "@material-ui/core";
import TimeDatePicker from "./TimeDatePicker";
import { useTheme } from "@material-ui/core";
import TimeBugSelectWithEmpty from "./TimeBugSelectWithEmpty";
import RichTextFieldEditor from "../../../controls/RichTextFieldEditor";
import TimeBugTagSelect from "../TimeBugTagSelect";
import TimeConfirmDialog from "../TimeConfirmDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoadedTimeTrack,
  getTimeTrackDeleteIdAndShown,
  getTimeTrackEditId,
  loadTimeTrack,
  modifyTimeTrack,
  removeTimeTrack,
  setTimeTrackDeleteShown,
  setTimeTrackEditShown,
} from "../../../store/timeTrack";

const useStyles = makeStyles((theme) => ({
  root: {},
  detail: {
    marginTop: theme.spacing(1),
  },
  heading: {
    textTransform: "uppercase",
  },
  textEditorGrid: { marginBottom: theme.spacing(1) },
  textEditorContainer: {
    height: "300px",
    border: "1px solid black",
    padding: "5px",
    marginTop: "10px",
    borderRadius: "10px",
    overflow: "auto",
  },
}));

const TimeEdit = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [openTimeEdit, setOpenTimeEdit] = useState(false);
  const [values, setValues] = useState({});
  const [selectedBugId, setSelectedBugId] = useState(-1);
  const [clearDesc, setClearDesc] = useState(false);
  const [loadedJsonDescription, setLoadedJsonDescription] = useState(null);
  const [formattedJsonDescription, setFormattedJsonDescription] = useState({});
  const [selectedTagValues, setSelectedTagValues] = useState([]);

  const timeTrackEditId = useSelector(getTimeTrackEditId);
  const timeTracker = useSelector(getLoadedTimeTrack);
  const { timeTrackId: timeTrackIdToDelete, shown: timeTrackDeleteShown } =
    useSelector(getTimeTrackDeleteIdAndShown);

  useEffect(() => {
    if (timeTrackEditId !== -1) {
      setOpenTimeEdit(true);
      dispatch(loadTimeTrack(timeTrackEditId));
    } else setOpenTimeEdit(false);
  }, [timeTrackEditId]);

  useEffect(() => {
    if (timeTrackEditId !== -1 && Object.keys(timeTracker).length !== 0) {
      setValues({
        startDateTime: new Date(timeTracker.startTime),
        endDateTime: new Date(timeTracker.stopTime),
      });
      setLoadedJsonDescription(timeTracker.description);
      setSelectedBugId(timeTracker.bugId);
      setSelectedTagValues(timeTracker.bugTags);
    }
  }, [timeTracker, timeTrackEditId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    var ttbt = [];
    selectedTagValues.forEach((tag) => {
      ttbt.push({
        timeTrackId: timeTracker.timeTrackId,
        bugTagId: tag.bugTagId,
      });
    });
    var newTimeTracker = {
      timeTrackId: timeTracker.timeTrackId,
      startSeconds: timeTracker.startSeconds,
      bugId: timeTracker.bugId,
      userId: timeTracker.userId,
      stop: timeTracker.stop ? timeTracker.stop : true,
      description: formattedJsonDescription,
      bugId: selectedBugId !== -1 ? selectedBugId : null,
      bugTags: ttbt,
    };

    if (timeTracker.startTime !== values.startDateTime.toISOString())
      newTimeTracker.startTime = values.startDateTime.toISOString();
    else newTimeTracker.startTime = timeTracker.startTime;

    if (timeTracker.stopTime !== values.endDateTime.toISOString())
      newTimeTracker.stopTime = values.endDateTime.toISOString();
    else newTimeTracker.stopTime = timeTracker.stopTime;

    dispatch(modifyTimeTrack(timeTracker.timeTrackId, newTimeTracker));
  };

  const handleDeleteTimeTrackShown = (e) => {
    dispatch(setTimeTrackDeleteShown(true, timeTrackEditId));
  };

  const handleClose = () => {
    dispatch(setTimeTrackEditShown(false));
  };

  const handleDeleteTimeTrackHidden = () => {
    dispatch(setTimeTrackDeleteShown(false));
  };
  const handleDeleteTimeTrack = () => {
    dispatch(removeTimeTrack(timeTrackIdToDelete));
  };

  return (
    <>
      <Popup
        topMargin={theme.spacing(10)}
        center={false}
        title="Edit Time"
        openPopup={openTimeEdit}
        setOpenPopup={handleClose}
      >
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item container xs={12}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  color="initial"
                  className={classes.heading}
                >
                  Details
                </Typography>
              </Grid>

              <Grid item xs={12} container className={classes.detail}>
                <Grid item sm={6} xs={12}>
                  <TimeBugSelectWithEmpty
                    selectedBugId={selectedBugId}
                    setSelectedBugId={setSelectedBugId}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TimeBugTagSelect
                    value={selectedTagValues}
                    setValue={setSelectedTagValues}
                  ></TimeBugTagSelect>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12} className={classes.textEditorGrid}>
                  <div className={classes.textEditorContainer}>
                    <RichTextFieldEditor
                      setContent={setFormattedJsonDescription}
                      clear={clearDesc}
                      setClear={setClearDesc}
                      defaultValue={loadedJsonDescription}
                    ></RichTextFieldEditor>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Divider variant="fullWidth" absolute></Divider>
            <Grid item xs={12} className={classes.heading}>
              <Typography variant="subtitle1" color="initial">
                Duration
              </Typography>
            </Grid>
            <TimeDatePicker
              setValues={setValues}
              timeTracker={timeTracker}
            ></TimeDatePicker>
            <Grid item xs={12} container spacing={1} justifyContent="flex-end">
              <Grid item>
                <Button
                  onClick={(e) => handleDeleteTimeTrackShown(e)}
                  variant="outlined"
                >
                  Delete
                </Button>
              </Grid>
              <Grid item>
                <Button color="primary" type="submit" variant="contained">
                  Modify
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>

        <TimeConfirmDialog
          openConfirmation={timeTrackDeleteShown}
          setOpenConfirmation={() => handleDeleteTimeTrackHidden()}
          deleteTimeRecord={() => handleDeleteTimeTrack()}
        ></TimeConfirmDialog>
      </Popup>
    </>
  );
};

export default TimeEdit;
