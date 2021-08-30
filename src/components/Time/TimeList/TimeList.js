import { makeStyles, Grid, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import TimeGroup from "./TimeGroup.js";
import { useDispatch, useSelector } from "react-redux";
import {
  emptyTimeTracks,
  getAllTimeTracksGroupedByDate,
  loadTimeTracks,
  loadTimeTracksByDate,
} from "../../../store/timeTrack";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "left" },
}));

const TimeList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const timeListGroupedByDate = useSelector(getAllTimeTracksGroupedByDate);
  const [timeListDateToFetch, setTimeListDateToFetch] = useState(new Date());

  useEffect(() => {
    var result = dispatch(loadTimeTracks(timeListDateToFetch));
    result.then(() =>
      setTimeListDateToFetch((date) => {
        var newDt = date;
        newDt.setDate(date.getDate() - 3);
        return newDt;
      })
    );
    return () => {
      dispatch(emptyTimeTracks());
    };
  }, [dispatch]);

  const handleLoadTimeTracks = async () => {
    var result = dispatch(loadTimeTracksByDate(timeListDateToFetch));
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
      <Grid item>
        <Button variant="contained" onClick={() => handleLoadTimeTracks()}>
          Load more
        </Button>
      </Grid>
    </Grid>
  );
};

export default TimeList;
