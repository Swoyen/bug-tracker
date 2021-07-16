import BugList from "./BugList";
import BugDetails from "./BugDetails";
import BugCreate from "./BugCreate";
import useBug from "../../hooks/useBug";
import { ENDPOINTS, createAPIEndPoint } from "../../api";

import React, { useContext, useEffect, useState } from "react";
import Button from "../../controls/Button";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import { cleanup } from "@testing-library/react";
import { UserContext } from "../../context/UserContext";

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

const Bug = (props) => {
  const { userName, setUserName, isLoggedIn, setIsLoggedIn } =
    useContext(UserContext);

  const {
    bugList,
    setBugList,
    selectedBugId,
    setSelectedBugId,
    handleInputChange,
    resetFormControls,
    resetList,
  } = useBug();

  const [openBugDetails, setOpenBugDetails] = useState(false);
  const [openBugCreate, setOpenBugCreate] = useState(false);
  const [users, setUsers] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedBugComponent, setSelectedBugComponent] = useState({});
  const [prevSelectedBugComponent, setPrevSelectedBugComponent] = useState({});

  const classes = useStyles();

  useEffect(() => {
    return () => {
      setSelectedBugComponent({});
      setPrevSelectedBugComponent({});
    };
  }, []);

  useEffect(() => {
    if (prevSelectedBugComponent.bugId === selectedBugComponent.bugId) {
      if (Object.keys(selectedBugComponent).length !== 0) {
        let item = bugList.find(
          (bug) => bug.bugId === selectedBugComponent.bugId
        );
        let index = bugList.indexOf(item);
        let newList = bugList;
        newList[index] = selectedBugComponent;
        setBugList(newList);
      }
    }
    setPrevSelectedBugComponent(selectedBugComponent);
  }, [
    selectedBugComponent.severity,
    selectedBugComponent.status,
    selectedBugComponent.reporter,
    selectedBugComponent.bugName,
  ]);

  useEffect(() => {
    setPrevSelectedBugComponent(selectedBugComponent);
  }, [selectedBugComponent]);

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

  const removeBugFromList = (bugId) => {
    let newList = bugList;
    let filtered = newList.filter((bug) => bug.bugId !== bugId);
    setBugList(filtered);
  };

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <Typography gutterBottom variant="h2" color="initial">
        Bug Tracker
      </Typography>
      <Grid className={classes.buttons} container justifyContent="flex-end">
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
          selectedBugComponent,
          setSelectedBugComponent,
          handleInputChange,
        }}
      ></BugList>
      <BugDetails
        {...{
          openBugDetails,
          setOpenBugDetails,
          users,
          statuses,
          severities,
          selectedBugId,
          setSelectedBugId,
          selectedBugComponent,
          setSelectedBugComponent,
          removeBugFromList,
          handleInputChange,
          resetList,
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
          resetList,
        }}
      ></BugCreate>
    </>
  );
};

export default Bug;
