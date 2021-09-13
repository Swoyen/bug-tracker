import { Button, CircularProgress } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";

const AsyncLoadButton = ({ loading, loadMore }) => {
  const theme = useTheme();

  return loading ? (
    <Button
      variant="contained"
      disabled
      startIcon={<CircularProgress size={20} />}
      style={{ marginTop: theme.spacing(1) }}
      onClick={loadMore}
    >
      Load More
    </Button>
  ) : (
    <Button
      variant="contained"
      style={{ marginTop: theme.spacing(1) }}
      onClick={loadMore}
    >
      Load More
    </Button>
  );
};

export default AsyncLoadButton;
