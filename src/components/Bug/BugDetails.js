import { Grid, makeStyles, Typography } from "@material-ui/core";
import { ErrorSharp } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import Select from "../../controls/Select";
import Popup from "../../layouts/Popup";

const useStyles = makeStyles((theme) => ({
  root: {},
  gridPropertiesParent: { padding: "20px" },
}));

const BugDetails = (props) => {
  const severityList = ["Low", "High", "Severe", "Sos"];
  const { openBugDetails, setOpenBugDetails, selectedBug, setSelectedBug } =
    props;
  const classes = useStyles();

  const handleChanged = (e) => {
    const { name, value } = e.target;
    setSelectedBug({ ...selectedBug, [name]: value });
  };

  return (
    <Popup
      class={classes.root}
      title={selectedBug ? selectedBug.bugName : ""}
      openPopup={openBugDetails}
      setOpenPopup={setOpenBugDetails}
    >
      {selectedBug ? (
        <Grid container spacing={0}>
          <Grid item xs={7}>
            <Typography>Description:</Typography>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
              illum veniam architecto veritatis minus voluptatem amet!
              Laudantium fugit omnis consequuntur?
            </p>
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
                <Typography variant="body2">{selectedBug.created}</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Reported by:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{selectedBug.reporter}</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Assigned to: </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{selectedBug.assignee}</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle2"> Status: </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{selectedBug.status}</Typography>
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
                  value={selectedBug.severity}
                  onChange={(e) => handleChanged(e)}
                  options={severityList}
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
