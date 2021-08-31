import { Button } from "@material-ui/core";
import React from "react";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import { useRef } from "react";
import { useState } from "react";

const BugAttachFile = () => {
  const fileInput = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [filename, setFilename] = useState("");

  const handleAttach = (e) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        console.log("file", file);
        console.log(x.target.result);
        setSelectedFile(file);
        setFilename(x.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilename("");
    }
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInput}
        onChange={handleAttach}
        accept="."
      ></input>
      <Button
        startIcon={<AttachFileRoundedIcon />}
        variant="outlined"
        color="primary"
        onClick={() => fileInput.current.click()}
      >
        Attach File
      </Button>
    </>
  );
};

export default BugAttachFile;
