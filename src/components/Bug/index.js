import BugList from "./BugList";
import BugDetails from "./BugDetails";
import BugCreate from "./BugCreate";
import useBug from "../../hooks/useBug";
import { ENDPOINTS, createAPIEndPoint } from "../../api";

import React, { useEffect, useState } from "react";
import Button from "../../controls/Button";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { Grid, makeStyles } from "@material-ui/core";

// const getFreshModelObject = () => ({
//   bugId: -1,
//   bugName: "",
//   reporter: "",
//   created: "",
//   status: "",
//   assignee: "",
//   severity: "",
// });

const useStyles = makeStyles((theme) => ({
  root: {},
  buttons: { marginBottom: theme.spacing(2) },
}));

const Bug = () => {
  const {
    selectedBugId,
    setSelectedBugId,
    handleInputChange,
    resetFormControls,
  } = useBug();

  const [openBugDetails, setOpenBugDetails] = useState(false);

  const [openBugCreate, setOpenBugCreate] = useState(false);

  const [bugList, setBugList] = useState([]);

  const [users, setUsers] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    createAPIEndPoint(ENDPOINTS.USER)
      .fetchAll()
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));

    createAPIEndPoint(ENDPOINTS.SEVERITY)
      .fetchAll()
      .then((res) => setSeverities(res.data))
      .catch((err) => console.log(err));

    createAPIEndPoint(ENDPOINTS.STATUS)
      .fetchAll()
      .then((res) => setStatuses(res.data))
      .catch((err) => console.log(err));

    createAPIEndPoint(ENDPOINTS.BUG)
      .fetchAll()
      .then((res) => setBugList(res.data))
      .catch((err) => console.log(err));
  }, []);

  const showCreateDialog = () => {
    setOpenBugCreate(true);
  };

  return (
    <>
      <Grid className={classes.buttons} container justify="flex-end">
        <Button
          startIcon={<AddOutlinedIcon />}
          onClick={(e) => showCreateDialog()}
        >
          Create
        </Button>
      </Grid>
      <BugList
        {...{
          bugList,
          openBugDetails,
          setOpenBugDetails,
          severities,
          selectedBugId,
          setSelectedBugId,
          handleInputChange,
        }}
      ></BugList>
      <BugDetails
        {...{
          openBugDetails,
          setOpenBugDetails,
          severities,
          selectedBugId,
          setSelectedBugId,
          handleInputChange,
        }}
      ></BugDetails>
      <BugCreate
        {...{
          bugList,
          setBugs: setBugList,
          users,
          severities,
          openBugCreate,
          setOpenBugCreate,
        }}
      ></BugCreate>
    </>
  );
};

export default Bug;
