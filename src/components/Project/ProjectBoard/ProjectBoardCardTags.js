import { Chip, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getBugById } from "../../../store/bugs";
import BugDetailsLabelChip from "../../Bug/Details/Labels/BugDetailsLabelChip";
const useStyles = makeStyles((theme) => ({
  bugChip: {
    height: "10px",
    width: "30px",
    fontSize: "0px",
    transition: "0.5s",
    margin: theme.spacing(0.1),
  },
  bugChipExpanded: {
    height: "25px",
    minWidth: "50px",
    fontSize: "0.7em",
    fontWeight: "500",
    color: "white",
    transition: "0.5s",
    margin: theme.spacing(0.1),
  },
}));

const ProjectBoardCardTags = ({ bugId }) => {
  const loadedBug = useSelector(getBugById(bugId));

  const [chipsExpanded, setChipsExpanded] = useState(false);

  const handleChipClicked = (bugTag) => {
    if (!chipsExpanded) setChipsExpanded(true);
    else {
      setChipsExpanded(false);
    }
  };

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
                // <Chip
                //   clickable
                //   onClick={() => handleChipClicked(bugTag)}
                //   key={bugTag.id}
                //   label={bugTag.name}
                //   className={chipsExpanded ? classes.bugChipExpanded : classes.bugChip}
                //   style={{ background: bugTag.color }}
                // ></Chip>
              );
            })
          : ""}
      </Grid>
    </>
  );
};

export default ProjectBoardCardTags;
