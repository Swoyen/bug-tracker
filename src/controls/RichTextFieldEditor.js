import React from "react";
import MUIRichTextEditor from "mui-rte";
import { /*EditorState,*/ convertToRaw } from "draft-js";
import { useState, useEffect } from "react";

let emptyContent =
  '{"blocks":[{"key":"5oqpu","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
const RichTextFieldEditor = (props) => {
  const {
    toolbarVisible,
    textEditorClasses,
    setContent,
    defaultValue,
    clear,
    setClear,
  } = props;

  const [defaultVal, setDefaultVal] = useState(emptyContent);

  useEffect(() => {
    if (clear) {
      setDefaultVal(emptyContent);
      setClear(false);
    }
  }, [clear]);

  useEffect(() => {
    setDefaultVal(defaultValue);
  }, [defaultValue]);

  const change = (state) => {
    let content = JSON.stringify(convertToRaw(state.getCurrentContent()));

    setContent(content);
  };

  return (
    <MUIRichTextEditor
      toolbar={toolbarVisible}
      defaultValue={defaultVal}
      className={textEditorClasses}
      label="Start Typing"
      toolbarButtonSize="small"
      onChange={change}
      onSave={(e) => console.log(e)}
    ></MUIRichTextEditor>
  );
};

export default RichTextFieldEditor;
