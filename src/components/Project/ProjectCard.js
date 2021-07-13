import React, { useState, useEffect } from "react";
import { createProjectAPIEndPoint } from "../../api";
import {
  Card,
  Typography,
  CardContent,
  makeStyles,
  Grid,
  ListItem,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 200,
    minWidth: 200,
    minHeight: 200,
    background: "#f7f7f7",
    cursor: "pointer",
    "&:hover": {
      background: "#dbd5d5",
    },
  },
}));

const ProjectCard = (props) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" color="initial">
          {props.name}
        </Typography>
        {props.children}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
