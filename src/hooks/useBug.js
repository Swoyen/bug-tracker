import React, { useState } from "react";
import { ENDPOINTS, createAPIEndPoint } from "../api";

const useBug = () => {
  const [selectedBugId, setSelectedBugId] = useState(-1);
  const [bugList, setBugList] = useState([]);

  const handleInputChange = (event) => {
    // const { name, value } = event.target;
    // setSelectedBug({
    //   ...selectedBug,
    //   [name]: value,
    // });
  };

  const resetList = () => {
    createAPIEndPoint(ENDPOINTS.BUG)
      .fetchAll()
      .then((res) => console.log())
      .catch((err) => console.log(err));
  };

  const resetFormControls = () => {
    setSelectedBugId(-1);
  };

  return {
    bugList,
    setBugList,
    selectedBugId,
    setSelectedBugId,
    handleInputChange,
    resetFormControls,
    resetList,
  };
};

export default useBug;
