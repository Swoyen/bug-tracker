import { useMsal } from "@azure/msal-react";
import React, { useState, createContext, useEffect } from "react";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../api";
import useBug from "../hooks/useBug";

export const BugContext = createContext();

export const BugProvider = (props) => {
  const { instance, accounts } = useMsal();
  const [openBugDetails, setOpenBugDetails] = useState(false);
  const [openBugCreate, setOpenBugCreate] = useState(false);
  const [users, setUsers] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedBugComponent, setSelectedBugComponent] = useState({});
  const [prevSelectedBugComponent, setPrevSelectedBugComponent] = useState({});

  const [selectedBug, setSelectedBug] = useState({});
  const [prevBugId, setPrevBugId] = useState(-1);
  const [openRecordConfirmDeleteDialog, setOpenRecordConfirmDeleteDialog] =
    useState(false);
  const [openCommentConfirmDeleteDialog, setOpenCommentConfirmDeleteDialog] =
    useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [bugName, setSelectedBugName] = useState();
  const [commentToDeleteId, setCommentToDeleteId] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState({});
  const [comments, setComments] = useState([]);

  const [bugDetails, setBugDetails] = useState({});
  const removeBugFromList = (bugId) => {
    let newList = bugList;
    let filtered = newList.filter((bug) => bug.bugId !== bugId);
    setBugList(filtered);
  };
  const {
    bugList,
    setBugList,
    selectedBugId,
    setSelectedBugId,
    handleInputChange,
    resetFormControls,
  } = useBug();

  const resetList = async () => {
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.BUG
    );
    let result = apiObj.fetchAll();
    result.then((res) => setBugList(res.data)).catch((err) => console.log(err));
  };

  const resetBugList = async () => {
    const bugApiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.BUG
    );
    var bugApiRes = bugApiObj.fetchAll();
    bugApiRes
      .then((res) => setBugList(res.data))
      .catch((err) => console.log(err));
  };

  const resetUserList = async () => {
    const userApiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.USER
    );
    var userApiRes = userApiObj.fetchAll();
    userApiRes
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  const resetSeverityList = async () => {
    const severityApiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.SEVERITY
    );
    var severityApiRes = severityApiObj.fetchAll();
    severityApiRes
      .then((res) => setSeverities(res.data))
      .catch((err) => console.log(err));
  };

  const resetStatusList = async () => {
    const statusApiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.STATUS
    );
    var statusApiRes = statusApiObj.fetchAll();
    statusApiRes
      .then((res) => setStatuses(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    (async () => {
      await resetUserList();

      await resetSeverityList();

      await resetStatusList();

      await resetBugList();
    })();
  }, []);

  return (
    <BugContext.Provider
      value={{
        openBugDetails,
        setOpenBugDetails,
        openBugCreate,
        setOpenBugCreate,
        users,
        setUsers,
        severities,
        setSeverities,
        statuses,
        setStatuses,
        selectedBugComponent,
        setSelectedBugComponent,
        prevSelectedBugComponent,
        setPrevSelectedBugComponent,
        bugDetails,
        setBugDetails,
        selectedBug,
        setSelectedBug,
        prevBugId,
        setPrevBugId,
        openRecordConfirmDeleteDialog,
        setOpenRecordConfirmDeleteDialog,
        openCommentConfirmDeleteDialog,
        setOpenCommentConfirmDeleteDialog,
        isEditable,
        setIsEditable,
        bugDescription,
        setBugDescription,
        bugName,
        setSelectedBugName,
        bugList,
        setBugList,
        selectedBugId,
        setSelectedBugId,
        handleInputChange,
        resetFormControls,
        resetList,
        removeBugFromList,
        commentToDeleteId,
        setCommentToDeleteId,
        commentToEdit,
        setCommentToEdit,
        comments,
        setComments,
      }}
    >
      {props.children}
    </BugContext.Provider>
  );
};
