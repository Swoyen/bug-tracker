import React, { useState } from "react";

const useBug = (getFreshModelObject) => {
  const [selectedBug, setSelectedBug] = useState(getFreshModelObject());

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedBug({
      ...selectedBug,
      [name]: value,
    });
  };

  const resetFormControls = () => {
    setSelectedBug(getFreshModelObject());
  };

  return { selectedBug, setSelectedBug, handleInputChange, resetFormControls };
};

export default useBug;
