import React, { useRef } from "react";
import { Button, Divider, Paper, useTheme } from "@material-ui/core";
import {
  makeStyles,
  Typography,
  IconButton,
  Grid,
  TextField,
} from "@material-ui/core";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { useState } from "react";
import Form from "../../../../layouts/Form";
import BugDetailsLabelSelectLabel from "./BugDetailsLabelSelectLabel";
import BugDetailsLabelCreateLabel from "./BugDetailsLabelCreateLabel";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import { Fade } from "@material-ui/core";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "300px",
    width: "300px",
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  backButton: {
    position: "absolute",
    top: 4,
    left: 4,
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 2,
  },
}));

const BugDetailsLabelDetails = ({ close }) => {
  const classes = useStyles();
  const [stage, setStage] = useState(1);
  const ref = useRef();
  const theme = useTheme();

  useEffect(() => {
    const onBodyClick = (event) => {
      if (ref.current.contains(event.target)) {
        return;
      }
      close();
    };
    document.body.addEventListener("mousedown", onBodyClick, { capture: true });
    return () => {
      document.body.removeEventListener("mousedown", onBodyClick, {
        capture: true,
      });
    };
  }, []);

  const handleGoToNextStage = () => {
    setStage((stage) => stage + 1);
  };

  const handleGoToPreviousStage = () => {
    setStage((stage) => stage - 1);
  };

  return (
    <Paper ref={ref} className={classes.root} elevation={2}>
      <IconButton
        size="small"
        className={classes.closeButton}
        aria-label="close"
        onClick={close}
      >
        <CloseRoundedIcon />
      </IconButton>
      {stage !== 1 ? (
        <IconButton
          size="small"
          className={classes.backButton}
          aria-label="back"
          onClick={handleGoToPreviousStage}
        >
          <ArrowBackIosRoundedIcon fontSize="small" />
        </IconButton>
      ) : (
        ""
      )}
      <Typography variant="subtitle1" color="initial" align="center">
        Labels
      </Typography>
      <Divider variant="middle"></Divider>
      <div style={{ padding: theme.spacing(1) }}>
        {stage === 1 ? (
          <Fade in={stage === 1}>
            <BugDetailsLabelSelectLabel goNext={handleGoToNextStage} />
          </Fade>
        ) : (
          <BugDetailsLabelCreateLabel goBack={handleGoToPreviousStage} />
        )}
      </div>
    </Paper>
  );
};

export default BugDetailsLabelDetails;
