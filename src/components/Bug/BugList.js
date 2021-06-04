import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import BugDetails from "./BugDetails";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 500,
  },
  bugRow: {
    cursor: "pointer",
  },
}));

function createBug(
  bugId,
  bugName,
  reporter,
  created,
  status,
  assignee,
  severity
) {
  return { bugId, bugName, reporter, created, status, assignee, severity };
}

const bugs = [
  createBug(1, "Fix Header", "Swoyen", "12/12/12", "Open", "God", "High"),
  createBug(
    2,
    "Mobile responsive",
    "Sam",
    "12/13/11",
    "To do",
    "Someone",
    "Low"
  ),
  createBug(3, "Labels hidden", "Dean", "1/2/19", "Open", "God", "Severe"),
  createBug(4, "Image not showing", "Ariel", "18/12/22", "Open", "God", "High"),
  createBug(5, "Page broken", "Hugo", "12/12/12", "Open", "God", "High"),
  createBug(6, "Fix Header", "Swoyen", "12/12/12", "Open", "God", "High"),
  createBug(
    7,
    "Mobile responsive",
    "Sam",
    "12/13/11",
    "To do",
    "Someone",
    "Low"
  ),
  createBug(8, "Labels hidden", "Dean", "1/2/19", "Open", "God", "Severe"),
  createBug(9, "Image not showing", "Ariel", "18/12/22", "Open", "God", "High"),
  createBug(10, "Page broken", "Hugo", "12/12/12", "Open", "God", "High"),
  createBug(11, "Fix Header", "Swoyen", "12/12/12", "Open", "God", "High"),
  createBug(
    12,
    "Mobile responsive",
    "Sam",
    "12/13/11",
    "To do",
    "Someone",
    "Low"
  ),
  createBug(13, "Labels hidden", "Dean", "1/2/19", "Open", "God", "Severe"),
  createBug(
    14,
    "Image not showing",
    "Ariel",
    "18/12/22",
    "Open",
    "God",
    "High"
  ),
  createBug(15, "Page broken", "Hugo", "12/12/12", "Open", "God", "High"),
];

var prevId = -1;

const BugList = (props) => {
  const { openBugDetails, setOpenBugDetails, selectedBug, setSelectedBug } =
    props;

  const classes = useStyles();

  const showBugDetails = (bug) => {
    setSelectedBug(bug);
    setOpenBugDetails(true);
  };

  useEffect(() => {
    let bug = bugs.find((bug) => {
      return bug.bugId === selectedBug.bugId;
    });

    if (bug && prevId === bug.bugId) {
      let index = bugs.indexOf(bug);
      bugs[index] = selectedBug;
    }
    if (bug) {
      prevId = bug.bugId;
    }
  }, [selectedBug]);

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
                  onClick={() => showBugDetails(bug)}
                  key={bug.bugId}
                >
                  <TableCell>{bug.bugName}</TableCell>
                  <TableCell>{bug.reporter}</TableCell>
                  <TableCell>{bug.created}</TableCell>
                  <TableCell>{bug.status}</TableCell>
                  <TableCell>{bug.assignee}</TableCell>
                  <TableCell>{bug.severity}</TableCell>
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
