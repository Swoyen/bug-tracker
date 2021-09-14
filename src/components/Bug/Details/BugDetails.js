import React, { useEffect } from "react";

import { Grid, makeStyles } from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { getShownBug, hideBug, loadBug } from "../../../store/bug";
import BugDetailsContentLoader from "./BugDetailsContentLoader";
import BugDetailsDescription from "./BugDetailsDescription";
import BugDetailsActionProperties from "./BugDetailsActionProperties";
import BugDetailsPopup from "./BugDetailsPopup";
import Button from "../../../controls/Button";
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

  const { id, shown, loading } = useSelector(getShownBug);

  useEffect(() => {
    if (shown) {
      dispatch(loadBug(id));
    }
  }, [id, shown, dispatch]);

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
