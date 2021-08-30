import { Chip, makeStyles } from "@material-ui/core";
import React from "react";
import { useState } from "react";
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

const ProjectBoardCardTags = (props) => {
  const { bugTags } = props;
  const classes = useStyles();
  const [chipsExpanded, setChipsExpanded] = useState(false);

  const handleChipClicked = (bugTag) => {
    if (!chipsExpanded) setChipsExpanded(true);
    else {
      setChipsExpanded(false);
    }
  };

  return bugTags.map((bugTag) => {
    return (
      <Chip
        clickable
        onClick={() => handleChipClicked(bugTag)}
        key={bugTag.id}
        label={bugTag.name}
        className={chipsExpanded ? classes.bugChipExpanded : classes.bugChip}
        style={{ background: bugTag.color }}
      ></Chip>
    );
  });
};

export default ProjectBoardCardTags;
