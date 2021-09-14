import { Grid } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { getBugById } from "../../../store/bugs";
import BugDetailsLabelChip from "../../Bug/Details/Labels/BugDetailsLabelChip";

const ProjectBoardCardTags = ({ bugId }) => {
  const loadedBug = useSelector(getBugById(bugId));

  return (
    <>
      <Grid container>
        {loadedBug && loadedBug.labels
          ? loadedBug.labels.map((label) => {
              return (
                <BugDetailsLabelChip
                  key={label.labelId}
                  label={label}
                  canDelete={false}
                  canExpand={true}
                />
              );
            })
          : ""}
      </Grid>
    </>
  );
};

export default ProjectBoardCardTags;
