import { makeStyles, Grid, Button } from "@material-ui/core";
import Dialog from "../../../layouts/Dialog";
import React, { useEffect } from "react";
import { useContext } from "react";
import { TimeContext } from "../../../context/TimeContext";
import TimeGroup from "./TimeGroup.js";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "left" },
}));

const TimeList = (props) => {
  const { timeListGroupedByDate, fetchTimeListByDate } =
    useContext(TimeContext);
  const classes = useStyles();

  useEffect(() => {}, []);
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
        <Button variant="contained" onClick={fetchTimeListByDate}>
          Load more
        </Button>
      </Grid>
    </Grid>
  );
};

export default TimeList;
