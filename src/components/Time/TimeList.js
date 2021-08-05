import { makeStyles, Grid } from "@material-ui/core";
import Dialog from "../../layouts/Dialog";
import React, { useEffect } from "react";
import { useContext } from "react";
import { TimeContext } from "../../context/TimeContext";
import TimeGroup from "./TimeGroup.js";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "left" },
}));

const TimeList = (props) => {
  const {
    openConfirmation,
    setOpenConfirmation,
    deleteTimeRecord,
    timeListGroupedByDate,
  } = useContext(TimeContext);
  const classes = useStyles();

  useEffect(() => {}, []);
  return (
    <Grid container className={classes.root} spacing={2}>
      {timeListGroupedByDate.map((timeList) => {
        var dateStr =
          timeList.date.date +
          "/" +
          timeList.date.month +
          "/" +
          timeList.date.year;

        return (
          <Grid item key={dateStr} xs={12}>
            <TimeGroup timeList={timeList}></TimeGroup>
          </Grid>
        );
      })}
      {/* {timeList.map((time) => {
        return (
          <Grid item xs={12} key={time.timeTrackId}>
            <TimePaper time={time}></TimePaper>
          </Grid>
        );
      })} */}
      <Dialog
        title="Confirm Delete"
        openDialog={openConfirmation}
        setOpenDialog={setOpenConfirmation}
        onConfirm={() => deleteTimeRecord()}
      >
        Are you sure you want to delete this record?
      </Dialog>
    </Grid>
  );
};

export default TimeList;
