import React, { useState, createContext, useEffect, useContext } from "react";
import useBug from "../hooks/useBug";

export const BugContext = createContext();

export const BugProvider = (props) => {
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

  // selectedBug, setSelectedBug,
  // prevBugId, setPrevBugId,
  // openConfirmDialog, setOpenConfirmDialog,
  // isEditable, setIsEditable,
  // bugDescription, setBugDescription,
  // bugName, setSelectedBugName,

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
    resetList,
  } = useBug();

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
