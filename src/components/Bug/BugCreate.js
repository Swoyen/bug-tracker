import React, { useState } from "react";
import Popup from "../../layouts/Popup";
import Grid from "@material-ui/core/Grid";
import { InputBase, makeStyles, Typography } from "@material-ui/core";
import Button from "../../controls/Button";
import Input from "../../controls/Input";
import Form from "../../layouts/Form";
import Select from "../../controls/Select";

const useStyles = makeStyles((theme) => ({
  root: {},
  createButton: {
    marginTop: theme.spacing(4),
  },
  grid: {
    flexGrow: 1,
  },
}));

const BugCreate = (props) => {
  const [bugName, setBugName] = useState("sad");
  const [bugDetails, setBugDetails] = useState("");
  const [reporter, setReporter] = useState("");
  const [assignee, setAssignee] = useState("");
  const [severity, setSeverity] = useState("");

  const { openBugCreate, setOpenBugCreate } = props;
  const classes = useStyles();

  const submitBug = (event) => {
    event.preventDefault();
    console.log("submitted");
  };

  const handleChanged = (event) => {
    console.log(event.target);
  };

  const changeBugName = (event) => {
    console.log("Here");
    setBugName(event.target.value);
  };

  const changeBugDetails = (event) => {
    setBugDetails(event.target.value);
  };

  const changeReporter = (event) => {
    setReporter(event.target.value);
  };

  const reporterOptions = ["Swoyen", "God", "Dog"];
  const assigneeOptions = ["Swoyen", "God", "Dog"];
  const severityOptions = ["Low", "High", "Severe"];

  return (
    <Popup
      title="Create Bug"
      openPopup={openBugCreate}
      setOpenPopup={setOpenBugCreate}
    >
      <Form onSubmit={submitBug}>
        <div className={classes.grid}>
          <Grid container spacing={1} justify="center">
            <Grid item container xs={10} spacing={1} alignItems="center">
              <Grid item xs={5}>
                <Typography variant="subtitle2">Name</Typography>
              </Grid>
              <Grid item xs={7}>
                {/* <Input
                  margin="dense"
                  label="Name"
                  name="bugName"
                  variant="outlined"
                  onChange={changeBugName}
                  value={bugName}
                ></Input> */}

                <InputBase
                  value={bugName}
                  onChange={(e) => setBugName(e.target.value)}
                ></InputBase>
              </Grid>
            </Grid>
            <Grid item container xs={10} spacing={1}>
              <Grid item xs={5}>
                <Typography variant="subtitle2">Details</Typography>
              </Grid>
              <Grid item xs={7}>
                <Input
                  label="Details"
                  name="bugDetails"
                  variant="outlined"
                  value={bugDetails}
                  onChange={(e) => changeBugDetails(e)}
                ></Input>
              </Grid>
            </Grid>
            <Grid item container xs={10} spacing={1}>
              <Grid item xs={5}>
                <Typography variant="subtitle2">Reporter</Typography>
              </Grid>
              <Grid item xs={7}>
                <Select
                  name="reporter"
                  label="Reporter"
                  value={reporter}
                  onChange={(e) => changeReporter(e)}
                  options={reporterOptions}
                ></Select>
              </Grid>
            </Grid>
            <Grid item container xs={10} spacing={1}>
              <Grid item xs={5}>
                <Typography variant="subtitle2">Assignee</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>Name</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={10} spacing={1}>
              <Grid item xs={5}>
                <Typography variant="subtitle2">Severity</Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography>Name</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            className={classes.createButton}
            container
            spacing={1}
            justify="center"
          >
            <Button>Hello</Button>
          </Grid>
        </div>
      </Form>
    </Popup>
  );
};

export default BugCreate;
