import { Typography } from "@material-ui/core";
import { List, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSeverities } from "./../../../store/severities";
import { useTheme } from "@material-ui/core";
import SeveritySummaryListItem from "./SeveritySummaryListItem";
import { loadSeverityCount } from "../../../store/summary";

const SeveritySummaryList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const severityList = useSelector((state) => state.entities.severities.list);
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );

  useEffect(() => {
    dispatch(loadSeverities());
  }, [dispatch]);

  useEffect(() => {
    if (severityList.length !== 0 && projectId !== -1)
      dispatch(loadSeverityCount(projectId));
  }, [severityList.length, dispatch, projectId]);

  return (
    <Paper elevation={2} style={{ padding: theme.spacing(1) }}>
      <Typography align="left" variant="subtitle1" color="initial">
        Severities
      </Typography>
      <List>
        {severityList.map((severity) => (
          <SeveritySummaryListItem
            key={severity.severityId}
            severity={severity}
          />
        ))}
      </List>
    </Paper>
  );
};

export default SeveritySummaryList;
