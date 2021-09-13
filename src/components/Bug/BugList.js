import React, { useEffect } from "react";
import {
  Avatar,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllBugs, getFilteredBugs, loadBugs } from "../../store/bugs";
import { showBug } from "../../store/bug";
import { BASE_URL, RESTRICTEDENDPOINTS } from "../../api/config";
import BugContentLoader from "./BugContentLoader";
import BugTableLoading from "./BugTableLoading";
import {
  getFormattedDateFromIsoString,
  getFormattedTimeFromIsoString,
} from "../../helper/timecalc";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 600,
  },
  bugRow: {
    cursor: "pointer",
  },
}));

const BugList = ({ resolved = false }) => {
  const dispatch = useDispatch();
  //const bugs = useSelector(getAllBugs);

  const bugs = useSelector(getFilteredBugs);
  const loading = useSelector((state) => state.entities.bugs.loading);
  const classes = useStyles();

  // const showBugDetails = (bug) => {
  //   setSelectedBugId(bug.bugId);
  //   setOpenBugDetails(true);
  //   setSelectedBugComponent(bug);
  // };

  const handleShowBugDetails = (bug) => {
    dispatch(showBug({ id: bug.bugId }));
  };
  return (
    <>
      {loading ? (
        <BugTableLoading />
      ) : (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="Bugs-table">
            <TableHead>
              {resolved ? (
                <TableRow>
                  <TableCell>Bug</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Resolved</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>Bug</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              )}
            </TableHead>
            {bugs.length > 0 ? (
              <TableBody>
                {bugs.map((bug) => {
                  return resolved ? (
                    <TableRow
                      className={classes.bugRow}
                      onClick={() => handleShowBugDetails(bug)}
                      key={bug.bugId}
                    >
                      <TableCell>{bug.bugName}</TableCell>
                      <TableCell>{bug.reporter.userName}</TableCell>
                      <TableCell>
                        {
                          <>
                            <b>Time: </b>
                            {getFormattedTimeFromIsoString(bug.resolvedTime)}
                            <br />
                            <b>Date: </b>
                            {getFormattedDateFromIsoString(bug.resolvedTime)}
                          </>
                        }
                      </TableCell>
                      <TableCell>{bug.status.statusName}</TableCell>
                      <TableCell>{bug.assignee.userName}</TableCell>
                      <TableCell>{bug.severity.severityName}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow
                      className={classes.bugRow}
                      onClick={() => handleShowBugDetails(bug)}
                      key={bug.bugId}
                    >
                      <TableCell>{bug.bugName}</TableCell>
                      <TableCell>{bug.reporter.userName}</TableCell>
                      <TableCell>{bug.status.statusName}</TableCell>
                      <TableCell>{bug.assignee.userName}</TableCell>
                      <TableCell>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Avatar
                              style={{ height: "15px", width: "15px" }}
                              src={`${BASE_URL}${RESTRICTEDENDPOINTS.IMAGE}/${bug.severity.iconName}`}
                            ></Avatar>
                          </Grid>
                          <Grid item>{bug.severity.severityName}</Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : resolved ? (
              <caption>
                There are no resolved bugs yet. Create and resolve some bugs
              </caption>
            ) : (
              <caption>No Bugs have been added. Create some bugs</caption>
            )}
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default BugList;
