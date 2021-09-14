import { Button, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddCardVisible,
  hideAddCard,
  showAddCard,
} from "../../../store/board";
import ProjectBoardCardAddCard from "./ProjectBoardCardAddCard";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    textAlign: "center",
  },
}));

const ProjectBoardCardAdd = ({ status, index }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const addCardShown = useSelector(getAddCardVisible(index));

  const handleAddCard = (index) => {
    dispatch(showAddCard(index));
  };

  const handleHideCard = (index) => {
    dispatch(hideAddCard(index));
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          {addCardShown ? (
            <ProjectBoardCardAddCard
              index={index}
              status={status}
              hideAddCard={() => handleHideCard(index)}
            />
          ) : (
            <Button fullWidth onClick={() => handleAddCard(index)}>
              + Add a card
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectBoardCardAdd;
