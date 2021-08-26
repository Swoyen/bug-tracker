import React, { useEffect, useState } from "react";
import Popup from "../../../layouts/Popup";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Typography } from "@material-ui/core";
import Button from "../../../controls/Button";
import Input from "../../../controls/Input";
import Form from "../../../layouts/Form";
import Select from "../../../controls/Select";
import { useDispatch, useSelector } from "react-redux";
import {
  addBug,
  getBugCreateShown,
  toggleBugCreateShown,
} from "../../../store/bugs";
import { getAllUsers, loadUsers } from "../../../store/users";
import { getAllSeverities, loadSeverities } from "../../../store/severities";
import { getAllStatuses, loadStatuses } from "../../../store/status";
import BugCreateSelect from "./BugCreateSelect";

const useStyles = makeStyles((theme) => ({
  root: {},
  createButton: {
    marginTop: theme.spacing(4),
  },
  grid: {
    flexGrow: 1,
  },
  fieldGrid: {
    height: "80",
  },
}));

const BugCreate = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const bugCreateShown = useSelector(getBugCreateShown);

  const users = useSelector(getAllUsers);
  const severities = useSelector(getAllSeverities);
  const statuses = useSelector(getAllStatuses);

  const [bugName, setBugName] = useState("");
  const [bugDetails, setBugDetails] = useState("");
  const [reporter, setReporter] = useState("");
  const [reporterId, setReporterId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [severity, setSeverity] = useState("");
  const [severityId, setSeverityId] = useState("");
  const [status, setStatus] = useState("");
  const [statusId, setStatusId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bugCreateShown) {
      dispatch(loadUsers());
      dispatch(loadStatuses());
      dispatch(loadSeverities());
    }
    return () => {
      resetForm();
    };
  }, [bugCreateShown]);

  const validateForm = () => {
    let temp = {};
    temp.bugName = bugName !== "" ? "" : "This field is required.";
    temp.reporter = reporter !== "" ? "" : "Choose an option.";
    temp.assignee = assignee !== "" ? "" : "Choose an option.";
    temp.severity = severity !== "" ? "" : "Choose an option.";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const handleAddBug = () => {
    let newBug = {};
    newBug.bugId = 0;
    newBug.bugName = bugName;
    newBug.bugDescription = bugDetails;
    newBug.reporterUserId = reporterId;
    newBug.assigneeUserId = assigneeId;
    newBug.createdDate = new Date().toISOString();
    newBug.statusId = 1;
    newBug.severityId = severityId;

    dispatch(addBug(newBug));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddBug();
    }
  };

  const resetForm = () => {
    setBugName("");
    setBugDetails("");
    setReporter("");
    setAssignee("");
    setSeverity("");
    setErrors({});
  };

  const handleChange = (event) => {
    let target = event.target;
    let value = target.value;
    let name = target.name;

    var el;
    switch (name) {
      case "bugName":
        setBugName(value);
        if (errors) setErrors({ ...errors, bugName: "" });
        break;
      case "bugDetails":
        setBugDetails(value);
        break;
      case "reporter":
        el = users.find((user) => user.userName === value);
        setReporterId(el.userId);
        setReporter(value);
        if (errors) setErrors({ ...errors, reporter: "" });
        break;
      case "assignee":
        el = users.find((user) => user.userName === value);
        setAssigneeId(el.userId);
        setAssignee(value);
        if (errors) setErrors({ ...errors, assignee: "" });
        break;
      case "severity":
        el = severities.find((severity) => severity.severityName === value);
        setSeverityId(el.severityId);
        setSeverity(value);
        if (errors) setErrors({ ...errors, severity: "" });
        break;
      case "status":
        el = statuses.find((status) => status.statusName === value);
        setStatusId(el.statusId);
        setStatus(value);
        if (errors) setErrors({ ...errors, status: "" });
        break;

      default:
        break;
    }
  };

  return (
    <Popup
      maxWidth="sm"
      title="Create Bug"
      openPopup={bugCreateShown}
      setOpenPopup={() => dispatch(toggleBugCreateShown())}
    >
      <Form onSubmit={(e) => handleSubmit(e)}>
        <div className={classes.grid}>
          <Grid container spacing={1} justifyContent="center">
            <Grid
              className={classes.fieldGrid}
              item
              container
              xs={10}
              spacing={1}
              alignItems="center"
            >
              <Grid item xs={5}>
                <Typography variant="subtitle2">Name</Typography>
              </Grid>
              <Grid item xs={7}>
                <Input
                  margin="dense"
                  name="bugName"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => handleChange(e)}
                  error={errors.bugName}
                  value={bugName}
                ></Input>
              </Grid>
            </Grid>

            <Grid
              className={classes.fieldGrid}
              item
              container
              xs={10}
              spacing={1}
              alignItems="center"
            >
              <Grid item xs={5}>
                <Typography variant="subtitle2">Details</Typography>
              </Grid>
              <Grid item xs={7}>
                <Input
                  fullWidth
                  margin="dense"
                  name="bugDetails"
                  variant="outlined"
                  value={bugDetails}
                  error={errors.bugDetails}
                  onChange={(e) => handleChange(e)}
                ></Input>
              </Grid>
            </Grid>

            <BugCreateSelect
              gridClass={classes.fieldGrid}
              title="Reporter"
              value={reporter}
              name="reporter"
              label="Reporter"
              error={errors.reporter}
              options={users}
              first="userId"
              second="userName"
              onChange={(e) => handleChange(e)}
            ></BugCreateSelect>

            <BugCreateSelect
              gridClass={classes.fieldGrid}
              title="Assignee"
              value={assignee}
              name="assignee"
              label="Assignee"
              error={errors.assignee}
              options={users}
              first="userId"
              second="userName"
              onChange={(e) => handleChange(e)}
            ></BugCreateSelect>

            <BugCreateSelect
              gridClass={classes.fieldGrid}
              title="Severity"
              value={severity}
              name="severity"
              label="Severity"
              error={errors.severity}
              options={severities}
              first="severityId"
              second="severityName"
              onChange={(e) => handleChange(e)}
            ></BugCreateSelect>

            <BugCreateSelect
              gridClass={classes.fieldGrid}
              title="Status"
              value={status}
              name="status"
              label="Status"
              error={errors.status}
              options={statuses}
              first="statusId"
              second="statusName"
              onChange={(e) => handleChange(e)}
            ></BugCreateSelect>
          </Grid>
          <Grid
            className={classes.createButton}
            container
            spacing={1}
            justifyContent="center"
          >
            <Button type="submit">Submit</Button>
          </Grid>
        </div>
      </Form>
    </Popup>
  );
};

export default BugCreate;
