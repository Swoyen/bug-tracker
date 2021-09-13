import { Button, CircularProgress, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AsyncLoadButton from "../../../controls/AsyncLoadButton";
import { loadMoreSummaryFromProjectId } from "../../../store/summary";

const ProjectSummaryLoadButton = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const projectId = useSelector(
    (state) => state.entities.projects.currentProjectId
  );
  const loading = useSelector((state) => state.entities.summary.moreLoading);

  const handleLoadMore = () => {
    dispatch(loadMoreSummaryFromProjectId(projectId));
  };

  return (
    <Grid
      style={{ marginTop: theme.spacing(1) }}
      container
      justifyContent="center"
      direction="column"
      alignItems="center"
    >
      <AsyncLoadButton loading={loading} loadMore={() => handleLoadMore()} />
    </Grid>
  );
};

export default ProjectSummaryLoadButton;
