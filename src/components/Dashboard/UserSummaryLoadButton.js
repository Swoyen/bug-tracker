import { Button, CircularProgress, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AsyncLoadButton from "../../controls/AsyncLoadButton";
import { loadMoreSummaryFromUserId } from "../../store/summary";

const UserSummaryLoadButton = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.entities.auth.userId);
  const loading = useSelector((state) => state.entities.summary.moreLoading);

  const handleLoadMore = () => {
    dispatch(loadMoreSummaryFromUserId(userId));
  };

  return (
    <Grid
      style={{ marginTop: theme.spacing(1) }}
      container
      justifyContent="center"
      direction="column"
      alignItems="center"
    >
      <AsyncLoadButton loading={loading} loadMore={() => handleLoadMore()} />
    </Grid>
  );
};

export default UserSummaryLoadButton;
