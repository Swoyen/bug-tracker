import { makeStyles, Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import TimeGroup from "./TimeGroup.js";
import { useDispatch, useSelector } from "react-redux";
import {
  emptyTimeTracks,
  getAllTimeTracksGroupedByDate,
  loadTimeTracks,
  loadTimeTracksByDate,
} from "../../../store/timeTrack";
import AsyncLoadButton from "../../../controls/AsyncLoadButton.js";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "left" },
}));

const TimeList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );

  const userId = useSelector((state) => state.entities.auth.userId);
  const timeListGroupedByDate = useSelector(getAllTimeTracksGroupedByDate);

  const [timeListDateToFetch, setTimeListDateToFetch] = useState(new Date());
  const loading = useSelector((state) => state.entities.timeTracks.loading);

  useEffect(() => {
    if (projectId !== -1 && userId !== null) {
      var result = dispatch(
        loadTimeTracks(timeListDateToFetch, projectId, userId)
      );
      result.then(() =>
        setTimeListDateToFetch((date) => {
          var newDt = date;
          newDt.setDate(date.getDate() - 3);
          return newDt;
        })
      );
    }
    return () => {
      dispatch(emptyTimeTracks());
    };
  }, [dispatch, projectId, userId, timeListDateToFetch]);

  const handleLoadTimeTracks = async () => {
    var result = dispatch(
      loadTimeTracksByDate(timeListDateToFetch, projectId, userId)
    );
    result.then(() =>
      setTimeListDateToFetch((date) => {
        var newDt = date;
        newDt.setDate(date.getDate() - 3);
        return newDt;
      })
    );
  };

  return (
    <Grid
      container
      className={classes.root}
      spacing={2}
      justifyContent="center"
    >
      {timeListGroupedByDate.map((timeList, index) => {
        var dateStr =
          timeList.date.date +
          "/" +
          timeList.date.month +
          "/" +
          timeList.date.year;

        return (
          <Grid item key={dateStr} xs={12}>
            <TimeGroup index={index} timeList={timeList}></TimeGroup>
          </Grid>
        );
      })}
      <Grid item container justifyContent="center">
        <Grid item>
          <AsyncLoadButton loading={loading} loadMore={handleLoadTimeTracks} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TimeList;
