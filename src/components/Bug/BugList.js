import React, { useEffect } from "react";
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllBugs, loadBugs } from "../../store/bugs";
import { showBug } from "../../store/bug";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  bugRow: {
    cursor: "pointer",
  },
}));

const BugList = (props) => {
  const dispatch = useDispatch();
  const bugs = useSelector(getAllBugs);

  useEffect(() => {
    dispatch(loadBugs());
  }, []);

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
      <TableContainer>
        <Table className={classes.table} aria-label="Bugs-table">
          <TableHead>
            <TableRow>
              <TableCell>Bug</TableCell>
              <TableCell>Reporter</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Severity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bugs.map((bug) => {
              return (
                <TableRow
                  className={classes.bugRow}
                  onClick={() => handleShowBugDetails(bug)}
                  key={bug.bugId}
                >
                  <TableCell>{bug.bugName}</TableCell>
                  <TableCell>{bug.reporter.userName}</TableCell>
                  <TableCell>{bug.createdDate}</TableCell>
                  <TableCell>{bug.status.statusName}</TableCell>
                  <TableCell>{bug.assignee.userName}</TableCell>
                  <TableCell>{bug.severity.severityName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BugList;
