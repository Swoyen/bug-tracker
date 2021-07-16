import {
  Grid,
  makeStyles,
  Typography,
  ButtonGroup,
  useTheme,
  Fade,
} from "@material-ui/core";
import { ErrorSharp } from "@material-ui/icons";
import { ENDPOINTS, createAPIEndPoint } from "../../api";
import React, { useState, useEffect } from "react";
import Select from "../../controls/Select";
import Popup from "../../layouts/Popup";
import Button from "../../controls/Button";
import Input from "../../controls/Input";
import { cleanup } from "@testing-library/react";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DoneTwoToneIcon from "@material-ui/icons/DoneTwoTone";
import Grow from "@material-ui/core/Grow";

const useStyles = makeStyles((theme) => ({
  root: {},
  actionButtonGroup: { marginBottom: "10px" },
  editButton: { background: "#0081A7" },
  doneButton: { background: "#06D6A0" },
  deleteButton: { background: "#C05746" },
  deleteDialogButtonGroup: { position: "absolute" },
  gridPropertiesParent: { padding: "20px" },
}));

const BugDetails = (props) => {
  const {
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
  } = props;
  const [selectedBug, setSelectedBug] = useState({});
  const [prevBugId, setPrevBugId] = useState(-1);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [bugName, setSelectedBugName] = useState();

  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    if (selectedBugId != -1) {
      createAPIEndPoint(ENDPOINTS.BUG)
        .fetchById(selectedBugId)
        .then((res) => {
          setIsEditable(false);
          let data = res.data;
          setSelectedBug(data);
          setBugDescription(data.bugDescription);
          setSelectedBugName(data.bugName);
        })
        .catch((err) => console.log(err));
    }
    return function cleanup() {
      setPrevBugId(selectedBugId);
    };
  }, [selectedBugId]);

  useEffect(() => {
    if (selectedBug && prevBugId === selectedBug.bugId) {
      let updatedBug = {};
      updatedBug.bugId = selectedBug.bugId;
      updatedBug.bugName = selectedBug.bugName;
      updatedBug.bugDescription = selectedBug.bugDescription;
      updatedBug.reporterUserId = selectedBug.reporter.userId;
      updatedBug.assigneeUserId = selectedBug.assignee.userId;
      updatedBug.createdDate = selectedBug.createdDate;
      updatedBug.severityId = selectedBug.severity.severityId;
      updatedBug.statusId = selectedBug.status.statusId;

      createAPIEndPoint(ENDPOINTS.BUG)
        .update(selectedBugId, updatedBug)
        .then((res) => {})
        .catch((err) => console.log(err));
      setSelectedBugComponent(selectedBug);
    }
    setPrevBugId(selectedBugId);
  }, [
    selectedBug.severity,
    selectedBug.status,
    selectedBug.reporter,
    selectedBug.bugDescription,
    selectedBug.bugName,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    var val;
    if (name === "severity") {
      val = severities.find((severity) => severity.severityName === value);
    } else if (name === "status") {
      val = statuses.find((status) => status.statusName === value);
    } else if (name === "reporter" || name === "assignee") {
      val = users.find((user) => user.userName === value);
    }
    setSelectedBug({
      ...selectedBug,
      [name]: val,
    });
  };

  const changeDescription = (event) => {
    setBugDescription(event.target.value);
  };

  const confirmDelete = () => {
    setOpenConfirmDialog(true);
  };

  const toggleEdit = () => {
    if (isEditable) {
      setSelectedBug({
        ...selectedBug,
        bugDescription: bugDescription,
        bugName: bugName,
      });
    }
    setIsEditable(!isEditable);
  };

  const deleteRecord = () => {
    createAPIEndPoint(ENDPOINTS.BUG)
      .delete(selectedBugId)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    removeBugFromList(selectedBugId);

    setOpenConfirmDialog(false);
    setOpenBugDetails(false);
  };

  return (
    <>
      <Popup
        class={classes.root}
        title={selectedBugId !== -1 ? bugName : ""}
        setTitle={setSelectedBugName}
        editTitle={isEditable}
        openPopup={openBugDetails}
        setOpenPopup={setOpenBugDetails}
        center={false}
        topMargin={theme.spacing(10)}
      >
        {selectedBugId !== -1 ? (
          <Grid container spacing={0}>
            <Grid item xs={7}>
              <Typography>Description:</Typography>

              {isEditable ? (
                <Grow in style={{ transformOrigin: "0 0 0" }}>
                  <Input
                    fullWidth
                    multiline
                    rows="5"
                    name="description"
                    label=""
                    variant="filled"
                    value={bugDescription}
                    onChange={(e) => changeDescription(e)}
                  ></Input>
                </Grow>
              ) : (
                <p>{selectedBug.bugDescription}</p>
              )}
            </Grid>
            <Grid
              className={classes.gridPropertiesParent}
              item
              container
              xs={5}
              spacing={2}
            >
              <Grid item container xs={12}>
                <Grid
                  container
                  item
                  xs={12}
                  alignItems="flex-end"
                  direction="row-reverse"
                  justifyContent="flex-start"
                >
                  <Grid item xs={2}>
                    <ButtonGroup
                      className={classes.actionButtonGroup}
                      variant="text"
                      color="default"
                      aria-label=""
                    >
                      {isEditable ? (
                        <Button
                          className={classes.doneButton}
                          onClick={() => toggleEdit()}
                        >
                          <DoneTwoToneIcon />
                        </Button>
                      ) : (
                        <Button
                          className={classes.editButton}
                          onClick={() => toggleEdit()}
                        >
                          <EditTwoToneIcon />
                        </Button>
                      )}

                      <Button
                        className={classes.deleteButton}
                        onClick={() => confirmDelete()}
                      >
                        <DeleteTwoToneIcon />
                      </Button>
                    </ButtonGroup>
                  </Grid>
                </Grid>
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
                  {isEditable ? (
                    <Select
                      label="Reporter"
                      name="reporter"
                      value={
                        selectedBug.reporter
                          ? selectedBug.reporter.userName
                          : ""
                      }
                      onChange={(e) => handleChange(e)}
                      options={users}
                      first="userId"
                      second="userName"
                    ></Select>
                  ) : (
                    <Typography variant="body2">
                      {selectedBug.reporter
                        ? selectedBug.reporter.userName
                        : ""}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Assigned to: </Typography>
                </Grid>
                <Grid item xs={6}>
                  {isEditable ? (
                    <Select
                      label="Assignee"
                      name="assignee"
                      value={
                        selectedBug.assignee
                          ? selectedBug.assignee.userName
                          : ""
                      }
                      onChange={(e) => handleChange(e)}
                      options={users}
                      first="userId"
                      second="userName"
                    ></Select>
                  ) : (
                    <Typography variant="body2">
                      {selectedBug.assignee
                        ? selectedBug.assignee.userName
                        : ""}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2"> Status: </Typography>
                </Grid>
                <Grid item xs={6}>
                  {isEditable ? (
                    <Select
                      label="Status"
                      name="status"
                      value={
                        selectedBug.status ? selectedBug.status.statusName : ""
                      }
                      onChange={(e) => handleChange(e)}
                      options={statuses}
                      first="statusId"
                      second="statusName"
                    ></Select>
                  ) : (
                    <Typography variant="body2">
                      {selectedBug.status ? selectedBug.status.statusName : ""}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2"> Severity: </Typography>
                </Grid>
                <Grid item xs={6}>
                  {isEditable ? (
                    <Select
                      label="Severity"
                      name="severity"
                      value={
                        selectedBug.severity
                          ? selectedBug.severity.severityName
                          : ""
                      }
                      onChange={(e) => handleChange(e)}
                      options={severities}
                      first="severityId"
                      second="severityName"
                    ></Select>
                  ) : (
                    <Typography variant="body2">
                      {selectedBug.severity
                        ? selectedBug.severity.severityName
                        : ""}
                    </Typography>
                  )}

                  {/* <Typography variant="body2">{selectedBug.severity}</Typography> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          ""
        )}
      </Popup>
      <Popup
        title="Confirm Delete"
        titleVariant="h5"
        openPopup={openConfirmDialog}
        setOpenPopup={setOpenConfirmDialog}
        topMargin={theme.spacing(15)}
        center={false}
      >
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Grid item>
              <Typography gutterBottom>
                Are you sure you want to delete?
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            alignItems="flex-end"
            direction="row-reverse"
            justifyContent="flex-start"
          >
            <Grid item>
              <ButtonGroup>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => deleteRecord()}
                >
                  Confirm
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setOpenConfirmDialog(false)}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </Popup>
    </>
  );
};

export default BugDetails;
