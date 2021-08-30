import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  emptyTimeTracks,
  loadTimeTracksByBug,
} from "../../../../store/timeTrack";
import Typography from "@material-ui/core/Typography";
import { useState } from "react";
import BugTimeTrackPaper from "./BugTimeTrackPaper";
import { makeStyles } from "@material-ui/core";
import { ClassSharp, StarRateRounded } from "@material-ui/icons";
import { Grid } from "@material-ui/core";
import { getDurationFromArray } from "../../../../helper/timecalc";

const useStyles = makeStyles((theme) => ({
  timeContainer: {
    maxHeight: "300px",
    overflow: "auto",
  },
  timepaper: { padding: theme.spacing(2), margin: theme.spacing(1) },
}));

const BugTimeTrack = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [totalDuration, setTotalDuration] = useState("0 h 0 mins");
  const bugId = useSelector((state) => state.entities.bug.id);
  const timeList = useSelector((state) => state.entities.timeTracks.list);
  useEffect(() => {
    if (bugId !== -1) dispatch(loadTimeTracksByBug(bugId));
    return () => {
      dispatch(emptyTimeTracks());
    };
  }, [bugId]);

  useEffect(() => {
    if (timeList.length > 0) {
      var startEnd = [];
      timeList.forEach((timeTrack) =>
        startEnd.push({
          startTime: timeTrack.startTime,
          endTime: timeTrack.stopTime,
        })
      );

      setTotalDuration(getDurationFromArray(startEnd));
    }
  }, [timeList]);
  return (
    <div>
      <Typography variant="subtitle2" color="initial">
        Total Duration: <b> {totalDuration}</b>
      </Typography>
      <Grid container>
        <Grid
          className={classes.timeContainer}
          container
          item
          xs={12}
          spacing={1}
        >
          {timeList.map((timeTrack) => (
            <Grid item xs={11} key={timeTrack.timeTrackId}>
              <BugTimeTrackPaper
                className={classes.timepaper}
                timeTrack={timeTrack}
              ></BugTimeTrackPaper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default BugTimeTrack;
