import {
  Button,
  Collapse,
  Grid,
  Grow,
  List,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSummaryFromUserId } from "../../store/summary";

import ProjectSummaryListItem from "../Project/ProjectSummary/ProjectSummaryListItem";

const UserSummaryList = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.entities.auth.userId);
  const actions = useSelector((state) => state.entities.summary.list);

  useEffect(() => {
    if (userId) {
      dispatch(loadSummaryFromUserId(userId));
    }
  }, [userId]);

  return (
    <Paper elevation={4}>
      <List dense>
        {actions.length !== 0 ? (
          actions.map((action, index) => (
            <ProjectSummaryListItem
              key={action.bugActionId}
              action={action}
              createDivider={index < actions.length - 1}
            />
          ))
        ) : (
          <Typography>Create and modify bugs to see their history</Typography>
        )}
      </List>
    </Paper>
  );
};

export default UserSummaryList;
