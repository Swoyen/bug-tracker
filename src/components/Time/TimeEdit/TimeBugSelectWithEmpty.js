import {
  InputLabel,
  Grid,
  Select,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBugs, loadUnresolvedBugs } from "../../../store/bugs";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

let emptyBug = { bugId: "-1", bugName: "Select a bug" };
const TimeBugSelectWithEmpty = (props) => {
  const classes = useStyles();
  const bugList = useSelector(getAllBugs);
  const dispatch = useDispatch();
  const { selectedBugId, setSelectedBugId } = props;
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );

  const [bugListWithEmptyBug, setBugListWithEmptyBug] = useState([emptyBug]);

  useEffect(() => {
    if (projectId !== -1) dispatch(loadUnresolvedBugs(projectId));
  }, [projectId, dispatch]);

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
