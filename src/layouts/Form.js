import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    "&. MuiFormControl-root": {
      width: "90%",
      margin: theme.spacing(1),
    },
  },
}));

const Form = (props) => {
  const classes = useStyles();
  const { ...other } = props;
  return (
    <form className={classes.root} noValidate autoComplete="off" {...other}>
      {props.children}
    </form>
  );
};

export default Form;
