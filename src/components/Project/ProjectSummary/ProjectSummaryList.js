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
import { loadSummaryFromProjectId } from "./../../../store/summary";
import ProjectSummaryListItem from "./ProjectSummaryListItem";

const ProjectSummaryList = () => {
  const dispatch = useDispatch();
  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );
  const actions = useSelector((state) => state.entities.summary.list);

  useEffect(() => {
    if (projectId !== -1) {
      dispatch(loadSummaryFromProjectId(projectId));
    }
  }, [projectId]);

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

export default ProjectSummaryList;
