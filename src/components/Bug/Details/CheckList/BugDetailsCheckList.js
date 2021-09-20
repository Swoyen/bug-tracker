import { Button, Fade, makeStyles, useTheme } from "@material-ui/core";
import { Grid, ListItem } from "@material-ui/core";
import { List, Typography } from "@material-ui/core";

import React from "react";
import { useState } from "react";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createCheckList,
  loadCheckList,
  unloadCheckList,
} from "../../../../store/checklist";
import { modifyBug } from "../../../../store/bug";
import BugCheckListItem from "./BugCheckListItem";
import BugCheckListInput from "./BugCheckListInput";
import LinearProgressWithLabel from "../../../../controls/LinearProgressWithLabel";

const useStyles = makeStyles((theme) => ({}));

const BugDetailsCheckList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const bugCheckListId = useSelector(
    (state) => state.entities.bug.loadedBug.checkListId
  );
  const checkListId = useSelector(
    (state) => state.entities.checkList.checkListId
  );
  const checkListItems = useSelector(
    (state) => state.entities.checkList.checkListItems
  );
  const loadedBug = useSelector((state) => state.entities.bug.loadedBug);
  const progress = useSelector((state) => state.entities.checkList.progress);

  useEffect(() => {
    if (bugCheckListId) {
      dispatch(loadCheckList(bugCheckListId));
      setCanCreateList(false);
    } else {
      setCanCreateList(true);
    }
    return () => {
      dispatch(unloadCheckList());
    };
  }, [bugCheckListId, dispatch]);

  useEffect(() => {
    if (
      checkListId &&
      loadedBug &&
      !loadedBug.checkListId &&
      loadedBug.checkListId !== checkListId
    ) {
      console.log("moidfy", checkListId);
      var bugWithCheckListId = { ...loadedBug, checkListId: checkListId };
      dispatch(modifyBug(loadedBug.bugId, bugWithCheckListId));
    }
  }, [loadedBug, checkListId, dispatch]);

  const [canCreateList, setCanCreateList] = useState(false);
  const [intializeButtonVisible, setInitializeButtonVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const theme = useTheme();

  const handleCreateList = () => {
    var data = { checkListId: 0 };
    dispatch(createCheckList(data)).then((res) => handleToggleInputVisible());
  };

  const handleToggleInputVisible = () => {
    setInputVisible((input) => !input);
  };

  return (
    <Grid container style={{ marginBottom: theme.spacing(2) }}>
      <Grid
        item
        xs={12}
        spacing={5}
        container
        onMouseOver={() => setInitializeButtonVisible(true)}
        onMouseLeave={() => setInitializeButtonVisible(false)}
        alignItems="center"
      >
        <Grid item>
          <Typography variant="subtitle1">CheckList:</Typography>
        </Grid>
        <Grid item>
          <Fade in={intializeButtonVisible}>
            {canCreateList ? (
              <Button
                size="small"
                startIcon={<AddCircleRoundedIcon />}
                onClick={handleCreateList}
                variant="outlined"
              >
                Create
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleToggleInputVisible}>
                Add Item
              </Button>
            )}
          </Fade>
        </Grid>
      </Grid>
      <Grid item xs={11}>
        <List>
          {checkListItems &&
            checkListItems.map((item) => {
              return (
                <BugCheckListItem
                  bugId={loadedBug.bugId}
                  key={item.checkListItemId}
                  item={item}
                />
              );
            })}
          {!canCreateList ? (
            inputVisible ? (
              <ListItem>
                <BugCheckListInput
                  checkListId={bugCheckListId}
                  handleToggleInputVisible={handleToggleInputVisible}
                />
              </ListItem>
            ) : (
              <ListItem className={classes.listItem}></ListItem>
            )
          ) : (
            ""
          )}
        </List>
        {checkListId && checkListItems.length > 0 ? (
          <LinearProgressWithLabel value={progress} variant="determinate" />
        ) : (
          ""
        )}
      </Grid>
    </Grid>
  );
};

export default BugDetailsCheckList;
