import {
  Button,
  makeStyles,
  Paper,
  TextField,
  IconButton,
  Grid,
} from "@material-ui/core";
import React from "react";
import { useState } from "react";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import Form from "../../../layouts/Form";
import { UserContext } from "../../../context/UserContext";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { addBug } from "../../../store/bugs";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: { padding: theme.spacing(1) },
}));

const ProjectBoardCardAddCard = ({ status, hideAddCard, index }) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const [errors, setErrors] = useState("");
  const { currentUser } = useContext(UserContext);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate) {
      // const apiObj = await createAuthenticatedEndPoint(
      //   instance,
      //   accounts,
      //   RESTRICTEDENDPOINTS.BUG
      // );
      var currentTime = new Date();
      var currentTimeISO = currentTime.toISOString();
      let newBug = {
        bugId: 0,
        bugName: text,
        bugDescription: "",
        reporterUserId: currentUser.userId,
        assigneeUserId: currentUser.userId,
        createdDate: currentTimeISO,
        statusId: status.statusId,
        severityId: 1,
      };
      const result = dispatch(addBug(newBug));

      result
        .then((res) => {
          handleClose();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleClose = () => {
    setText("");
    hideAddCard();
  };

  const validate = () => {
    if (text !== "") return true;
    return false;
  };

  return (
    <Paper className={classes.root}>
      <Form className={classes.form} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              id="add"
              variant="outlined"
              placeholder="Enter a title for this card"
              value={text}
              fullWidth
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" type="submit">
              Add card
            </Button>
            <IconButton aria-label="cancel" onClick={handleClose}>
              <CloseRoundedIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Form>
    </Paper>
  );
};

export default ProjectBoardCardAddCard;
