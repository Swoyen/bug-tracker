import React, { useContext, useState, useEffect, useCallback } from "react";

import { TimeContext } from "../../../context/TimeContext";
import Popup from "../../../layouts/Popup";
import Form from "../../../layouts/Form";
import { useMsal } from "@azure/msal-react";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../../api";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  Divider,
  Input,
  makeStyles,
  TextField,
} from "@material-ui/core";
import TimeDatePicker from "./TimeDatePicker";
import TimeEditInput from "./TimeEditInput";
import { useTheme } from "@material-ui/core";
import { BugReportOutlined } from "@material-ui/icons";
import TimeBugSelectWithEmpty from "./TimeBugSelectWithEmpty";
import RichTextFieldEditor from "../../../controls/RichTextFieldEditor";
import TimeBugTagSelect from "../TimeBugTagSelect";

import Dialog from "../../../layouts/Dialog";
import TimeConfirmDialog from "../TimeConfirmDialog";

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
  const {
    openTimeEdit,
    setOpenTimeEdit,
    timeTrackIdToEdit,
    setTimeTrackIdToDelete,
    setOpenConfirmation,
    openConfirmation,
    deleteTimeRecord,
    fetchTimeList,
  } = useContext(TimeContext);
  const { instance, accounts } = useMsal();
  const [timeTracker, setTimeTracker] = useState({});
  const [values, setValues] = useState({});
  const [selectedBugId, setSelectedBugId] = useState(-1);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [clearDesc, setClearDesc] = useState(false);
  const [loadedJsonDescription, setLoadedJsonDescription] = useState(null);
  const [formattedJsonDescription, setFormattedJsonDescription] = useState({});
  const [selectedTagValues, setSelectedTagValues] = useState([]);
  const theme = useTheme();

  const fetchTimeTrack = useCallback(async () => {
    if (timeTrackIdToEdit !== -1) {
      const api = await createAuthenticatedEndPoint(
        instance,
        accounts,
        RESTRICTEDENDPOINTS.TIMER
      );
      api
        .fetchById(timeTrackIdToEdit)
        .then((res) => {
          let data = res.data;
          setTimeTracker(res.data);
          setValues({
            startDateTime: new Date(data.startTime),
            endDateTime: new Date(data.stopTime),
          });
          setLoadedJsonDescription(data.description);
          setSelectedBugId(data.bugId);
          setSelectedTagValues(data.bugTags);
        })
        .catch((err) => console.log(err));
    }
  }, [instance, accounts, timeTrackIdToEdit]);

  useEffect(() => {
    if (openTimeEdit) {
      fetchTimeTrack();
    }
    return () => {
      setTimeTracker({});
      setLoadedJsonDescription("");
      setSelectedBugId(-1);
      setSelectedTagValues([]);
    };
  }, [fetchTimeTrack, openTimeEdit]);

  const handleDelete = (e) => {
    setTimeTrackIdToDelete(timeTrackIdToEdit);
    setOpenConfirmation(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var ttbt = [];
    selectedTagValues.forEach((tag) => {
      ttbt.push({
        timeTrackId: timeTracker.timeTrackId,
        bugTagId: tag.bugTagId,
      });
    });
    console.log(ttbt);
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

    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.TIMER
    );
    apiObj
      .update(timeTrackIdToEdit, newTimeTracker)
      .then((res) => {
        setOpenTimeEdit(false);
        // fetchTimeList();
        fetchTimeList();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Popup
        topMargin={theme.spacing(10)}
        center={false}
        title="Edit Time"
        openPopup={openTimeEdit}
        setOpenPopup={setOpenTimeEdit}
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
                  <div
                    className={classes.textEditorContainer}
                    onFocus={() => setToolbarVisible(true)}
                    className={classes.textEditorContainer}
                  >
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
                <Button onClick={(e) => handleDelete(e)} variant="outlined">
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
          openConfirmation={openConfirmation}
          setOpenConfirmation={setOpenConfirmation}
          deleteTimeRecord={deleteTimeRecord}
        ></TimeConfirmDialog>
      </Popup>
    </>
  );
};

export default TimeEdit;
