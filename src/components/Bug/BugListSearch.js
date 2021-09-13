import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setBugsFilterParam, setBugsSearchTerm } from "../../store/bugs";

const BugListSearch = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.entities.bugs.searchTerm);
  const filterParams = useSelector((state) => state.entities.bugs.filterParam);

  const handleParamsChange = (e) => {
    dispatch(setBugsFilterParam(e.target.value));
  };
  const handleReset = () => {
    dispatch(setBugsFilterParam(""));
    dispatch(setBugsSearchTerm("all"));
  };

  const handleInputChange = (e) => {
    // dispatch(setSearchTerm(e.target.value));
    dispatch(setBugsSearchTerm(e.target.value));
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <FormControl>
          <TextField
            value={searchTerm}
            onChange={(e) => handleInputChange(e)}
            margin="dense"
            variant="outlined"
            label="Search Term"
            placeholder="Filter the cards..."
          ></TextField>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl style={{ minWidth: "150px" }}>
          <InputLabel id="demo-simple-select-helper-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={filterParams}
            onChange={handleParamsChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="label">Label</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="description">Description</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="severity">Severity</MenuItem>
            <MenuItem value="reporter">Reporter</MenuItem>
            <MenuItem value="assignee">Assignee</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <Tooltip title="Reset">
          <IconButton aria-label="Search" onClick={handleReset}>
            <RotateLeftIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default BugListSearch;
