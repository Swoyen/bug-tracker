import React, { useEffect, useContext } from "react";

import { Grid, makeStyles } from "@material-ui/core";
import BugComment from "../Comment/BugComment";

import { useDispatch, useSelector } from "react-redux";
import { getShownBug, loadBug } from "../../../store/bug";
import BugDetailsContentLoader from "./BugDetailsContentLoader";
import BugDetailsDescription from "./BugDetailsDescription";
import BugDetailsActionProperties from "./BugDetailsActionProperties";
import BugDetailsPopup from "./BugDetailsPopup";

const useStyles = makeStyles((theme) => ({
  deleteDialogButtonGroup: { position: "absolute" },
  gridPropertiesParent: {
    padding: "20px",
    maxHeight: "300px",
  },
  desc: { paddingLeft: "10px", height: "120px" },
}));

const BugDetails = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { id, shown, loading } = useSelector(getShownBug);

  useEffect(() => {
    if (shown) {
      dispatch(loadBug(id));
    }
  }, [id, shown]);

  return (
    <>
      <BugDetailsPopup>
        {loading ? (
          <BugDetailsContentLoader />
        ) : id !== -1 ? (
          <Grid container spacing={0}>
            <Grid item container xs={7}>
              <BugDetailsDescription />
              <BugComment />
            </Grid>
            <BugDetailsActionProperties />
          </Grid>
        ) : (
          ""
        )}
      </BugDetailsPopup>
    </>
  );
};

export default BugDetails;
