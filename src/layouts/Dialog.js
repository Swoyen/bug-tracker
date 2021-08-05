import React from "react";
import Button from "../controls/Button";
import { Dialog as MuiDialog, makeStyles } from "@material-ui/core/";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 12345,
  },
  wrapper: {
    position: "absolute",
    margin: theme.spacing(1),
    top: (props) => props.top,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Dialog = (props) => {
  const {
    title,
    variant = "outlined",
    openDialog,
    setOpenDialog,
    onConfirm,
  } = props;

  const classes = useStyles(props);

  // const handleClickOpen = () => {
  //   setOpenDialog(true);
  // };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleAgree = () => {
    setOpenDialog(false);
    onConfirm();
  };

  return (
    <div>
      <MuiDialog
        className={classes.root}
        classes={{ paper: classes.wrapper }}
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        variant={variant}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => handleClose()}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAgree()}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </MuiDialog>
    </div>
  );
};

export default Dialog;
