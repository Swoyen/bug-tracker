import {
  InputLabel,
  Grid,
  Select,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { useContext } from "react";
import { BugContext } from "../../../context/BugContext";
import React, { useState, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

let emptyBug = { bugId: "-1", bugName: "Select a bug" };
const TimeBugSelectWithEmpty = (props) => {
  const classes = useStyles();
  const { bugList } = useContext(BugContext);
  const { selectedBugId, setSelectedBugId } = props;

  const [bugListWithEmptyBug, setBugListWithEmptyBug] = useState([emptyBug]);
  useEffect(() => {
    setBugListWithEmptyBug([emptyBug, ...bugList]);

    return () => {
      setBugListWithEmptyBug([emptyBug]);
    };
  }, [bugList]);

  return (
    <>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <InputLabel shrink id="bug">
            Bug
          </InputLabel>
        </Grid>
        <Grid item xs={12}>
          <Select
            style={{ minWidth: "300px" }}
            labelId="label"
            id="bug"
            value={selectedBugId ? selectedBugId : "-1"}
          >
            {bugListWithEmptyBug.map((bug) => {
              return (
                <MenuItem
                  disabled={bug.bugId === "-1" ? true : false}
                  key={bug.bugId}
                  value={bug.bugId}
                  onClick={() => setSelectedBugId(bug.bugId)}
                >
                  {bug.bugName}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
    </>
  );
};

export default TimeBugSelectWithEmpty;
