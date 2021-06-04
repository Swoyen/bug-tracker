import { makeStyles, Button as MuiButton } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const Button = (props) => {
  const { children, color, variant, onClick, className, ...other } = props;
  const classes = useStyles();

  return (
    <MuiButton
      className={classes.root + " " + (className || "")}
      variant={variant || "contained"}
      color={color || "default"}
      onClick={onClick}
      {...other}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
