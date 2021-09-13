import { List, Typography, Paper, useTheme } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAttachedFiles } from "../../../../store/bug";

import BugAttachFileListItem from "./BugAttachFileListItem";
const BugAttachFileList = () => {
  const dispatch = useDispatch();
  const bugId = useSelector((state) => state.entities.bug.loadedBug.bugId);
  const theme = useTheme();
  const attachments = useSelector((state) => state.entities.bug.attachments);

  useEffect(() => {
    if (bugId !== -1) {
      dispatch(loadAttachedFiles(bugId));
    }
  }, [bugId]);

  return (
    <>
      <Typography variant="subtitle2" color="initial">
        Uploads:
      </Typography>
      <Paper style={{ maxHeight: 400, overflow: "auto" }}>
        {attachments.length === 0 ? (
          <Typography variant="body2" style={{ padding: theme.spacing(1) }}>
            No uploads ...
          </Typography>
        ) : (
          <List>
            {attachments.map((attachment, index) => {
              return (
                <BugAttachFileListItem
                  key={attachment.attachmentId}
                  attachment={attachment}
                  index={index}
                  totalLength={attachments.length}
                />
              );
            })}
          </List>
        )}
      </Paper>
    </>
  );
};

export default BugAttachFileList;
