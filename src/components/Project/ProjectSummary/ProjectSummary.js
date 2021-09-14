import { Grid, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import ProjectSummaryList from "./ProjectSummaryList";
import StatusSummaryList from "./StatusSummaryList";
import SeveritySummaryList from "./SeveritySummaryList";
import ProjectSummaryLoadButton from "./ProjectSummaryLoadButton";
import { useDispatch } from "react-redux";
import { unloadSummary } from "../../../store/summary";

const ProjectSummary = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(unloadSummary());
    };
  }, [dispatch]);
  return (
    <>
      <Typography gutterBottom align="left" variant="h5">
        Project Summary
      </Typography>
      <Grid container spacing={1}>
        <Grid
          item
          sm={8}
          xs={12}
          style={{ maxHeight: "80vh", overflow: "auto" }}
        >
          <ProjectSummaryList />
          <ProjectSummaryLoadButton />
        </Grid>
        <Grid item sm={4} xs={12} container direction="column" spacing={1}>
          <Grid item>
            <StatusSummaryList />
          </Grid>
          <Grid item>
            <SeveritySummaryList />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectSummary;
