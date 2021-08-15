import { Button, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ProjectBoardCardAddCard from "./ProjectBoardCardAddCard";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    textAlign: "center",
  },
}));

const ProjectBoardCardAdd = ({
  showAddCard,
  hideAddCard,
  addCardShown,
  resetList,
  status,
}) => {
  const classes = useStyles();

  const handleAddCard = () => {
    showAddCard();
  };

  const handleHideCard = () => {
    hideAddCard();
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          {addCardShown ? (
            <ProjectBoardCardAddCard
              status={status}
              resetList={resetList}
              hideAddCard={handleHideCard}
            />
          ) : (
            <Button fullWidth onClick={handleAddCard}>
              + Add a card
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectBoardCardAdd;
