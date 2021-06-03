import React from "react";
import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    padding: theme.spacing(1),
    position: "absolute",
    top: theme.spacing(5),
  },
  dialogTitle: {
    paddingRight: "0px",
  },
  closeButton: {
    position: "absolute",
    top: "0px",
    right: "0px",
  },
  content: {
    paddingLeft: 30,
    paddingRight: 30,
  },
}));

const Popup = (props) => {
  const { openPopup, setOpenPopup, title } = props;
  const classes = useStyles();

  return (
    <Dialog
      classes={{ paper: classes.dialogWrapper }}
      open={openPopup}
      maxWidth="md"
      aria-labelledby=""
    >
      <DialogTitle
        disableTypography
        className={classes.dialogTitle}
        id="simple-title"
      >
        <Typography variant="h4" color="initial">
          {title}
        </Typography>
        <IconButton
          className={classes.closeButton}
          onClick={() => setOpenPopup(false)}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        {props.children}
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
