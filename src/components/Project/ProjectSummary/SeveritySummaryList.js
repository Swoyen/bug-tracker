import { Typography } from "@material-ui/core";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  IconButton,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStatuses } from "./../../../store/status";
import { loadSeverities } from "./../../../store/severities";
import { Delete } from "@material-ui/icons/";
import Brightness1Icon from "@material-ui/icons/Brightness1";
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
  }, []);

  useEffect(() => {
    if (severityList.length !== 0) dispatch(loadSeverityCount(projectId));
  }, [severityList.length]);

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
