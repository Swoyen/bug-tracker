import { Grid } from "@material-ui/core";
import React from "react";
import TimeGroupPaper from "./TimeGroupPaper";
import TimePaper from "./TimePaper";

const TimeBugGroup = ({ timeGroupByBug }) => {
  return (
    <>
      {timeGroupByBug ? (
        timeGroupByBug.timeTracks.length > 1 ? (
          <Grid item xs={12}>
            <TimeGroupPaper timeGroupByBug={timeGroupByBug}></TimeGroupPaper>
          </Grid>
        ) : (
          timeGroupByBug.timeTracks.map((time) => {
            return (
              <Grid item xs={12} key={time.timeTrackId}>
                <TimePaper time={time}></TimePaper>
              </Grid>
            );
          })
        )
      ) : (
        ""
      )}
    </>
  );
};

export default TimeBugGroup;
