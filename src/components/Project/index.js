import React, { useState, useEffect } from "react";
import { createProjectApiEndPoint } from "../../api";
import { Card, Typography, CardContent, makeStyles } from "@material-ui/core";
import ProjectList from "./ProjectList";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 200,
    minHeight: 200,
  },
}));

const Project = () => {
  const classes = useStyles();
  return <ProjectList></ProjectList>;
};

export default Project;
