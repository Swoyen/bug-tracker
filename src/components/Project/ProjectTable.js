import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import SettingsTwoToneIcon from "@material-ui/icons/SettingsTwoTone";
import { Typography } from "@material-ui/core";

import { BASE_URL } from "../../api";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects, setProjectSettingsShown } from "../../store/projects";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
});

const ProjectTable = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const projects = useSelector(getAllProjects);

  const handleShowProjectSettings = (projectId) => {
    dispatch(setProjectSettingsShown(true, projectId));
  };

  return (
    <TableContainer component={Paper}>
      <Table
        padding="normal"
        className={classes.table}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Project ID</TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">Created Date</TableCell>
            <TableCell size="medium" align="left">
              Created By
            </TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects &&
            projects.map((project) => (
              <TableRow key={project.title}>
                <TableCell component="th" scope="row">
                  {project.projectId}
                </TableCell>
                <TableCell align="left">
                  <Link
                    className={classes.link}
                    to={`/projects/${project.projectId}`}
                  >
                    <Grid alignItems="center" container spacing={3}>
                      <Grid item xs={2}>
                        <img
                          src={`${BASE_URL}Image/${project.imageName}`}
                          alt=""
                          style={{
                            width: "40px",
                            height: "40px",
                            margin: "auto",
                            borderRadius: "50%",
                          }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <Typography variant="subtitle2">
                          {project.title}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Link>
                </TableCell>
                <TableCell align="left">{project.createdTime}</TableCell>
                <TableCell align="left">{project.creator.userName}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    aria-label=""
                    onClick={() => handleShowProjectSettings(project.projectId)}
                  >
                    <SettingsTwoToneIcon></SettingsTwoToneIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectTable;
