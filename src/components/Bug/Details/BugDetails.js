import React, { useEffect, useContext } from "react";

import { Grid, makeStyles } from "@material-ui/core";
import BugComment from "../Comment/BugComment";

import { useDispatch, useSelector } from "react-redux";
import {
  getShownBug,
  hideBug,
  loadBug,
  setBugResolveShown,
} from "../../../store/bug";
import BugDetailsContentLoader from "./BugDetailsContentLoader";
import BugDetailsDescription from "./BugDetailsDescription";
import BugDetailsActionProperties from "./BugDetailsActionProperties";
import BugDetailsPopup from "./BugDetailsPopup";
import Button from "../../../controls/Button";
import DoneOutlineRoundedIcon from "@material-ui/icons/DoneOutlineRounded";
import BugDetailActivities from "./Activities/BugDetailActivities";
import BugDetailsLabels from "./Labels/BugDetailsLabels";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import BugDetailsCheckList from "./CheckList/BugDetailsCheckList";

const useStyles = makeStyles((theme) => ({
  deleteDialogButtonGroup: { position: "absolute" },
  gridPropertiesParent: {
    padding: "20px",
    maxHeight: "300px",
  },
  desc: { minHeight: "120px", maxHeight: "250px" },
  button: { textAlign: "right" },
  activities: { background: "red" },
}));

const BugDetails = ({ removeFromBoard = false }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { id, shown, loading, loadedBug } = useSelector(getShownBug);

  useEffect(() => {
    if (shown) {
      dispatch(loadBug(id));
    }
  }, [id, shown]);

  return (
    <>
      <BugDetailsPopup removeFromBoard={removeFromBoard}>
        {loading ? (
          <BugDetailsContentLoader />
        ) : id !== -1 ? (
          <Grid container spacing={0}>
            <Grid item container xs={7} alignContent="flex-start">
              <BugDetailsLabels />
              <BugDetailsDescription />
              <BugDetailsCheckList />
              <BugDetailActivities />
            </Grid>
            <BugDetailsActionProperties />
            <Grid
              className={classes.button}
              item
              xs={12}
              container
              justifyContent="flex-end"
            >
              <Button
                onClick={() => dispatch(hideBug())}
                startIcon={<CancelRoundedIcon />}
                color="primary"
              >
                close
              </Button>
            </Grid>
          </Grid>
        ) : (
          ""
        )}
      </BugDetailsPopup>
    </>
  );
};

export default BugDetails;
