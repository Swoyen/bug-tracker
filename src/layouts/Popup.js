import React from "react";
import Input from "../controls/Input";
import {
  Dialog,
  DialogContent,
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
    zIndex: 1234,
  },
  top: {
    top: (props) => props.topMargin,
  },
  middle: {
    top: "50%",
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
  titleInput: {
    fontSize: 33,
    margin: 1,
    padding: 1,
  },
}));

const Popup = (props) => {
  const {
    openPopup,
    setOpenPopup,
    title,
    setTitle,
    editTitle = false,
    titleVariant = "h5",
    center = false,
    maxWidth = "md",
    topMargin,
  } = props;
  const classes = useStyles(props);

  return (
    <Dialog
      classes={{
        paper: `${classes.dialogWrapper} ${
          center ? classes.middle : classes.top
        }`,
      }}
      open={openPopup}
      maxWidth={maxWidth}
      aria-labelledby=""
    >
      <DialogTitle
        disableTypography
        className={classes.dialogTitle}
        id="simple-title"
      >
        {editTitle ? (
          <Input
            className={classes.titleInput}
            name="title"
            label=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              classes: {
                input: classes.titleInput,
              },
            }}
          ></Input>
        ) : (
          <Typography variant={titleVariant} color="initial">
            {title}
          </Typography>
        )}
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
