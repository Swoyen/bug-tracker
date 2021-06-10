import React, { useState } from "react";

const useBug = () => {
  const [selectedBugId, setSelectedBugId] = useState(-1);

  const handleInputChange = (event) => {
    // const { name, value } = event.target;
    // setSelectedBug({
    //   ...selectedBug,
    //   [name]: value,
    // });
  };

  const resetFormControls = () => {
    setSelectedBugId(-1);
  };

  return {
    selectedBugId,
    setSelectedBugId,
    handleInputChange,
    resetFormControls,
  };
};

export default useBug;
