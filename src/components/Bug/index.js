import BugList from "./BugList";
import BugDetails from "./BugDetails";
import BugCreate from "./BugCreate";
import useBug from "../../hooks/useBug";

import React, { useState } from "react";
import Button from "../../controls/Button";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { Grid, makeStyles } from "@material-ui/core";

const getFreshModelObject = () => ({
  bugId: -1,
  bugName: "",
  reporter: "",
  created: "",
  status: "Pending",
  assignee: "Me",
  severity: "Low",
});

const useStyles = makeStyles((theme) => ({
  root: {},
  buttons: { marginBottom: theme.spacing(2) },
}));

const Bug = () => {
  const { selectedBug, setSelectedBug, handleInputChange, resetFormControls } =
    useBug(getFreshModelObject);

  const [openBugDetails, setOpenBugDetails] = useState(false);
  const [openBugCreate, setOpenBugCreate] = useState(false);
  const classes = useStyles();

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
          openBugDetails,
          setOpenBugDetails,
          selectedBug,
          setSelectedBug,
          handleInputChange,
        }}
      ></BugList>
      <BugDetails
        {...{
          openBugDetails,
          setOpenBugDetails,
          selectedBug,
          setSelectedBug,
          handleInputChange,
        }}
      ></BugDetails>
      <BugCreate {...{ openBugCreate, setOpenBugCreate }}></BugCreate>
    </>
  );
};

export default Bug;
