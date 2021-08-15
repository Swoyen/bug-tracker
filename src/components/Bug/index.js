import BugList from "./BugList";
import BugCreate from "./BugCreate";
import React, { useContext, useEffect } from "react";
import Button from "../../controls/Button";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { BugContext } from "../../context/BugContext";
import BugDetails from "./BugDetails";

const useStyles = makeStyles((theme) => ({
  root: {},
  buttons: { marginBottom: theme.spacing(2) },
}));

const Bug = () => {
  const {
    openBugDetails,
    setOpenBugDetails,
    openBugCreate,
    setOpenBugCreate,
    users,
    severities,
    selectedBugComponent,
    setSelectedBugComponent,
    prevSelectedBugComponent,
    setPrevSelectedBugComponent,
    bugList,
    setBugList,
    selectedBugId,
    setSelectedBugId,
    handleInputChange,
    resetList,
  } = useContext(BugContext);

  const classes = useStyles();

  useEffect(() => {
    return () => {
      setSelectedBugComponent({});
      setPrevSelectedBugComponent({});
    };
  }, [setSelectedBugComponent, setPrevSelectedBugComponent]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedBugComponent.severity,
    selectedBugComponent.status,
    selectedBugComponent.reporter,
    selectedBugComponent.bugName,
    //Maybe dont need this
  ]);

  useEffect(() => {
    setPrevSelectedBugComponent(selectedBugComponent);
  }, [selectedBugComponent, setPrevSelectedBugComponent]);

  const showCreateDialog = () => {
    setOpenBugCreate(true);
  };

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
      <BugDetails></BugDetails>
    </>
  );
};

export default Bug;
