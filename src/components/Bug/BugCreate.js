import React, { useEffect, useState } from "react";
import Popup from "../../layouts/Popup";
import Grid from "@material-ui/core/Grid";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../api";
import { makeStyles, Typography } from "@material-ui/core";
import Button from "../../controls/Button";
import Input from "../../controls/Input";
import Form from "../../layouts/Form";
import Select from "../../controls/Select";
import { useMsal } from "@azure/msal-react";
import { useContext } from "react";
import { BugContext } from "../../context/BugContext";

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
  const { instance, accounts } = useMsal();
  const [bugName, setBugName] = useState("");
  const [bugDetails, setBugDetails] = useState("");
  const [reporter, setReporter] = useState("");
  const [reporterId, setReporterId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [severity, setSeverity] = useState("");
  const [severityId, setSeverityId] = useState("");
  const [errors, setErrors] = useState({});

  const { users, severities, openBugCreate, setOpenBugCreate } = props;
  const { resetList } = useContext(BugContext);

  const classes = useStyles();

  useEffect(() => {
    resetForm();
  }, [openBugCreate]);

  const validateForm = () => {
    let temp = {};
    temp.bugName = bugName !== "" ? "" : "This field is required.";
    temp.reporter = reporter !== "" ? "" : "Choose an option.";
    temp.assignee = assignee !== "" ? "" : "Choose an option.";
    temp.severity = severity !== "" ? "" : "Choose an option.";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const AddBug = async () => {
    let newBug = {};
    newBug.bugId = 0;
    newBug.bugName = bugName;
    newBug.bugDescription = bugDetails;
    newBug.reporterUserId = reporterId;
    newBug.assigneeUserId = assigneeId;
    newBug.createdDate = "2021-06-09T00:00:00";
    newBug.statusId = 1;
    newBug.severityId = severityId;

    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.BUG
    );
    const result = apiObj.create(newBug);
    result
      .then((res) => resetList(instance, accounts))
      .catch((err) => console.log(err));
  };

  const submitBug = (e) => {
    e.preventDefault();
    if (validateForm()) {
      AddBug();
      setOpenBugCreate(false);
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

  const changeValue = (event) => {
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
      default:
        break;
    }
  };
  return (
    <Popup
      title="Create Bug"
      openPopup={openBugCreate}
      setOpenPopup={setOpenBugCreate}
    >
      <Form onSubmit={(e) => submitBug(e)}>
        <div className={classes.grid}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item container xs={10} spacing={1} alignItems="center">
              <Grid item xs={5}>
                <Typography variant="subtitle2">Name</Typography>
              </Grid>
              <Grid item xs={7}>
                <Input
                  margin="dense"
                  label="Name"
                  name="bugName"
                  variant="outlined"
                  onChange={(e) => changeValue(e)}
                  error={errors.bugName}
                  value={bugName}
                ></Input>
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
                  error={errors.bugDetails}
                  onChange={(e) => changeValue(e)}
                ></Input>
              </Grid>
            </Grid>
            <Grid item container xs={10} spacing={1}>
              <Grid item xs={5}>
                <Typography variant="subtitle2">Reporter</Typography>
              </Grid>
              <Grid item xs={7}>
                <Select
                  variant="outlined"
                  name="reporter"
                  label="Reporter"
                  value={reporter}
                  onChange={(e) => changeValue(e)}
                  error={errors.reporter}
                  options={users}
                  first="userId"
                  second="userName"
                ></Select>
              </Grid>
            </Grid>
            <Grid item container xs={10} spacing={1}>
              <Grid item xs={5}>
                <Typography variant="subtitle2">Assignee</Typography>
              </Grid>
              <Grid item xs={7}>
                <Select
                  name="assignee"
                  label="Assignee"
                  value={assignee}
                  onChange={(e) => changeValue(e)}
                  error={errors.assignee}
                  options={users}
                  first="userId"
                  second="userName"
                ></Select>
              </Grid>
            </Grid>
            <Grid item container xs={10} spacing={1}>
              <Grid item xs={5}>
                <Typography variant="subtitle2">Severity</Typography>
              </Grid>
              <Grid item xs={7}>
                <Select
                  name="severity"
                  label="Severity"
                  value={severity}
                  onChange={(e) => changeValue(e)}
                  error={errors.severity}
                  options={severities}
                  first="severityId"
                  second="severityName"
                ></Select>
              </Grid>
            </Grid>
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
