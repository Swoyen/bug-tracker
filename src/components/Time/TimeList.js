import { makeStyles, ThemeProvider, Grid, Paper } from "@material-ui/core";
import TimePaper from "./TimePaper";
import Dialog from "../../layouts/Dialog";
import React, { useEffect, useState } from "react";
import { createRestrictedAPIEndPoint, RESTRICTEDENDPOINTS } from "../../api";

const useStyles = makeStyles((theme) => ({
  root: { textAlign: "left" },
}));

const TimeList = (props) => {
  const { timeList, setTimeList } = props;
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [timeTrackIdToDelete, setTimeTrackIdToDelete] = useState(-1);
  const [actionsShownId, setActionsShownId] = useState(-1);
  const classes = useStyles();

  const deleteTimeRecord = () => {
    createRestrictedAPIEndPoint(RESTRICTEDENDPOINTS.TIMER)
      .delete(timeTrackIdToDelete)
      .then((res) => {
        let temp = timeList;
        temp = temp.filter((time) => time.timeTrackId !== timeTrackIdToDelete);
        console.log(temp);
        setTimeList(temp);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {}, []);
  return (
    <Grid container className={classes.root}>
      {timeList.map((time) => {
        return (
          <Grid item xs={12} key={time.timeTrackId}>
            <TimePaper
              time={time}
              setOpenConfirmation={setOpenConfirmation}
              setTimeTrackIdToDelete={setTimeTrackIdToDelete}
              actionsShownId={actionsShownId}
              setActionsShownId={setActionsShownId}
            ></TimePaper>
          </Grid>
        );
      })}
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
