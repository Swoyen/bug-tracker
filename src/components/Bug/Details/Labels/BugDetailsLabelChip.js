import { Chip, useTheme } from "@material-ui/core";
import React from "react";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { useDispatch, useSelector } from "react-redux";
import { getLabelName } from "../../../../store/labels";
import { useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { setProjectCardLabelsExpanded } from "../../../../store/board";

const useStyles = makeStyles((theme) => ({
  chipDivExpanded: {
    display: "inline-block",
    cursor: "pointer",
    margin: theme.spacing(0.2),
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: theme.spacing(1),
    height: "20px",
    whiteSpace: "nowrap",
    transition: "height 0.1s",
  },
  chipDivCollapsed: {
    display: "inline-block",
    cursor: "pointer",
    margin: theme.spacing(0.2),
    padding: theme.spacing(0.3),
    borderRadius: theme.spacing(1),
    height: "5px",
    whiteSpace: "nowrap",
    transition: "height 0.1s 0.1s, width 0.2s",
  },
  innerDivCollapsed: {
    display: "inline-block",
    overflow: "hidden",
    //fontSize: "0px",
    width: "0%",
    transition: "width 0.1s",
  },
  innerDivExpanded: {
    display: "inline-block",
    overflow: "hidden",
    width: "100%",
    //fontSize: "0px",
    transition: "width 0.1s  0.1s",
  },
  collapsedChip: {
    margin: theme.spacing(0.1),
    padding: theme.spacing(0),
    fontSize: 0,
    width: "30px",
    height: "10px",
    transition: "height 0.1s, width 0.2s",
  },
  expandedChip: {
    margin: theme.spacing(0.1),
    padding: theme.spacing(0.5),
    width: "100%",
    transition: "height 0.1s, width 0.2s",
  },
}));

const BugDetailsLabelChip = ({
  label,
  handleDelete,
  canDelete = true,
  canExpand = false,
}) => {
  const theme = useTheme();
  const classes = useStyles();

  const expanded = useSelector((state) => state.entities.board.labelsExpanded);
  const labelName = useSelector(getLabelName(label.labelId));
  const dispatch = useDispatch();

  const handleExpand = () => {
    if (!canExpand) return;
    //setExpanded(!expanded);
    dispatch(setProjectCardLabelsExpanded(!expanded));
  };

  return canExpand ? (
    <div
      onClick={handleExpand}
      style={{
        background: label.label.color,
        color: theme.palette.secondary.main,
        fontWeight: 600,
      }}
      className={expanded ? classes.chipDivExpanded : classes.chipDivCollapsed}
    >
      <div
        className={
          expanded ? classes.innerDivExpanded : classes.innerDivCollapsed
        }
      >
        <Typography
          style={{ fontWeight: 600 }}
          variant="caption"
          color="initial"
        >
          {labelName}
        </Typography>
      </div>
    </div>
  ) : canDelete ? (
    <Chip
      label={labelName}
      onDelete={() => handleDelete(label.labelId)}
      style={{
        background: label.label.color,
        margin: theme.spacing(0.5),
        color: theme.palette.secondary.main,
        fontWeight: 600,
        padding: theme.spacing(0.5),
      }}
      deleteIcon={
        <HighlightOffRoundedIcon
          style={{ color: theme.palette.primary.dark }}
        />
      }
    />
  ) : (
    <Chip
      label={labelName}
      style={{
        background: label.label.color,
        margin: theme.spacing(0.5),
        color: theme.palette.secondary.main,
        fontWeight: 600,
        padding: theme.spacing(0.5),
      }}
    />
    // <Chip
    //   onClick={handleExpand}
    //   className={expanded ? classes.expandedChip : classes.collapsedChip}
    //   label={labelName}
    //   size="small"
    //   style={{
    //     background: label.label.color,
    //     color: theme.palette.secondary.main,
    //     fontWeight: 600,
    //   }}
    //   deleteIcon={
    //     <HighlightOffRoundedIcon
    //       style={{ color: theme.palette.primary.dark }}
    //     />
    //   }
    // />
  );
};

export default BugDetailsLabelChip;
