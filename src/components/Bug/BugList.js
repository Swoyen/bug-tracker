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

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  bugRow: {
    cursor: "pointer",
  },
}));

const BugList = (props) => {
  const {
    bugList,
    setOpenBugDetails,
    selectedBugId,
    setSelectedBugId,
    setSelectedBugComponent,
  } = props;

  const classes = useStyles();

  const showBugDetails = (bug) => {
    setSelectedBugId(bug.bugId);
    setOpenBugDetails(true);
    setSelectedBugComponent(bug);
  };

  useEffect(() => {}, [selectedBugId]);

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
            {bugList.map((bug) => {
              return (
                <TableRow
                  className={classes.bugRow}
                  onClick={() => showBugDetails(bug)}
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
