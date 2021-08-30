import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShownBug, getToggled, modifyBug } from "../../../store/bug";
import { getAllSeverities, loadSeverities } from "../../../store/severities";
import { getAllStatuses, loadStatuses } from "../../../store/status";
import { getAllUsers, loadUsers } from "../../../store/users";
import BugDetailsSelectInput from "./BugDetailsSelectInput";

const BugDetailsProperties = (props) => {
  const canEdit = useSelector(getToggled);

  const { loadedBug, id } = useSelector(getShownBug);

  const dispatch = useDispatch();
  const users = useSelector(getAllUsers);
  const statuses = useSelector(getAllStatuses);
  const severities = useSelector(getAllSeverities);

  useEffect(() => {
    dispatch(loadUsers());
    dispatch(loadStatuses());
    dispatch(loadSeverities());
  }, []);

  const handleChange = (e) => {
    let propertyName = e.target.name;

    var propertyValue = e.target.value;
    console.log(propertyValue);
    var newPropertyValue;
    switch (propertyName) {
      case "severity":
        let severity = severities.find(
          (severity) => severity.severityName === propertyValue
        );
        newPropertyValue = severity;
        break;
      case "status":
        let status = statuses.find(
          (status) => status.statusName === propertyValue
        );
        newPropertyValue = status;
        break;
      case "assignee":
        let assignee = users.find((user) => user.userName === propertyValue);
        newPropertyValue = assignee;
        console.log("newVal", newPropertyValue);
        break;
      case "reporter":
        let reporter = users.find((user) => user.userName === propertyValue);
        newPropertyValue = reporter;
        break;
      default:
        break;
    }
    const newBug = {
      ...loadedBug,
      [propertyName]: newPropertyValue,
    };

    console.log("changed Bug", newBug);

    dispatch(modifyBug(id, newBug));
  };

  return (
    <>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Created at:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2">{loadedBug.createdDate}</Typography>
        </Grid>
      </Grid>

      <BugDetailsSelectInput
        title="Reported by:"
        canEdit={canEdit}
        label="Reporter"
        name="reporter"
        value={loadedBug.reporter ? loadedBug.reporter.userName : ""}
        onChange={(e) => handleChange(e)}
        options={users}
        first="userId"
        second="userName"
      ></BugDetailsSelectInput>

      <BugDetailsSelectInput
        title="Assigned to:"
        canEdit={canEdit}
        label="Assignee"
        name="assignee"
        value={loadedBug.assignee ? loadedBug.assignee.userName : ""}
        onChange={(e) => handleChange(e)}
        options={users}
        first="userId"
        second="userName"
      ></BugDetailsSelectInput>

      <BugDetailsSelectInput
        title="Status:"
        canEdit={canEdit}
        label="Status"
        name="status"
        value={loadedBug.status ? loadedBug.status.statusName : ""}
        onChange={(e) => handleChange(e)}
        options={statuses}
        first="statusId"
        second="statusName"
      ></BugDetailsSelectInput>

      <BugDetailsSelectInput
        title="Severity:"
        canEdit={canEdit}
        label="Severity"
        name="severity"
        value={loadedBug.severity ? loadedBug.severity.severityName : ""}
        onChange={(e) => handleChange(e)}
        options={severities}
        first="severityId"
        second="severityName"
      ></BugDetailsSelectInput>
    </>
  );
};

export default BugDetailsProperties;
