import { makeStyles } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import RichTextFieldEditor from "../../../controls/RichTextFieldEditor";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const TimeDescriptionEditor = (props) => {
  const {
    formattedJsonDefaultValue,
    setFormattedJsonDescription,
    clearDesc,
    setClearDesc,
  } = props;

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const classes = useStyles();
  return (
    <div
      style={{
        height: toolbarVisible ? "200px" : "100px",
        background: "yellow",
      }}
      onFocus={() => setToolbarVisible(true)}
      className={classes.textEditorContainer}
    >
      {/* <RichTextFieldEditor
        setContent={setFormattedJsonDescription}
        clear={clearDesc}
        setClear={setClearDesc}
        defaultValue={formattedJsonDefaultValue}
      ></RichTextFieldEditor> */}
    </div>
  );
};

export default TimeDescriptionEditor;
