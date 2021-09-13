import { useTheme } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { List, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStatusCount } from "../../../store/summary";
import { loadStatuses } from "./../../../store/status";
import StatusSummaryListItem from "./StatusSummaryListItem";

const StatusSummaryList = () => {
  const dispatch = useDispatch();
  const statusList = useSelector((state) => state.entities.statuses.list);
  const theme = useTheme();
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );
  useEffect(() => {
    dispatch(loadStatuses());
  }, []);

  useEffect(() => {
    if (statusList.length !== 0) dispatch(loadStatusCount(projectId));
  }, [statusList.length]);

  return (
    <Paper elevation={2} style={{ padding: theme.spacing(1) }}>
      <Typography align="left" variant="subtitle1" color="initial">
        Statuses
      </Typography>
      <List>
        {statusList.map((status) => (
          <StatusSummaryListItem key={status.statusId} status={status} />
        ))}
      </List>
    </Paper>
  );
};

export default StatusSummaryList;
