import {
  LinearProgress,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import BugContentLoader from "./BugContentLoader";

const BugTableLoading = () => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bug</TableCell>
              <TableCell>Reporter</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Severity</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <LinearProgress />
      <BugContentLoader />
    </>
  );
};

export default BugTableLoading;
