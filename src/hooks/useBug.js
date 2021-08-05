import { useState } from "react";

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
  };
};

export default useBug;
