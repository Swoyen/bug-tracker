import React from "react";
import BugPostComment from "./BugPostComment";
import BugCommentList from "./BugCommentList";

import { Grid, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

const BugComment = () => {
  const { resolved } = useSelector((state) => state.entities.bug.loadedBug);
  return (
    <Grid item xs={12}>
      {resolved ? "" : <BugPostComment></BugPostComment>}
      <Typography variant="subtitle2" color="initial">
        Comments:
      </Typography>
      <BugCommentList></BugCommentList>
    </Grid>
  );
};

export default BugComment;
