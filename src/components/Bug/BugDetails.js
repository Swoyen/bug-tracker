import { Grid, makeStyles, Typography } from "@material-ui/core";
import { ErrorSharp } from "@material-ui/icons";
import { ENDPOINTS, createAPIEndPoint } from "../../api";
import React, { useState, useEffect } from "react";
import Select from "../../controls/Select";
import Popup from "../../layouts/Popup";

const useStyles = makeStyles((theme) => ({
  root: {},
  gridPropertiesParent: { padding: "20px" },
}));

const BugDetails = (props) => {
  const {
    openBugDetails,
    setOpenBugDetails,
    severities,
    selectedBugId,
    setSelectedBugId,
    handleInputChange,
  } = props;
  const [selectedBug, setSelectedBug] = useState({});
  const classes = useStyles();

  useEffect(() => {
    if (selectedBugId != -1)
      createAPIEndPoint(ENDPOINTS.BUG)
        .fetchById(selectedBugId)
        .then((res) => {
          setSelectedBug(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
  }, [selectedBugId]);

  return (
    <Popup
      class={classes.root}
      title={selectedBugId !== -1 ? selectedBug.bugName : ""}
      openPopup={openBugDetails}
      setOpenPopup={setOpenBugDetails}
    >
      {selectedBugId !== -1 ? (
        <Grid container spacing={0}>
          <Grid item xs={7}>
            <Typography>Description:</Typography>
            <p>{selectedBug.bugDescription}</p>
          </Grid>
          <Grid
            className={classes.gridPropertiesParent}
            item
            container
            xs={5}
            spacing={2}
          >
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Created at:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {selectedBug.createdDate}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Reported by:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {selectedBug.reporter ? selectedBug.reporter.userName : ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Assigned to: </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {selectedBug.assignee ? selectedBug.assignee.userName : ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle2"> Status: </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {selectedBug.status ? selectedBug.status.statusName : ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle2"> Severity: </Typography>
              </Grid>
              <Grid item xs={6}>
                <Select
                  label="Severity"
                  name="severity"
                  value={
                    selectedBug.severity
                      ? selectedBug.severity.severityName
                      : ""
                  }
                  onChange={(e) => handleInputChange(e)}
                  options={severities}
                  first="severityId"
                  second="severityName"
                ></Select>
                {/* <Typography variant="body2">{selectedBug.severity}</Typography> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </Popup>
  );
};

export default BugDetails;
