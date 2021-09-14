import {
  Grid,
  TextField,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import React from "react";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFilterParams, setSearchTerm } from "../../../store/board";

const ProjectBoardSearch = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.entities.board.searchTerm);
  const filterParams = useSelector(
    (state) => state.entities.board.filterParams
  );

  const handleParamsChange = (e) => {
    dispatch(setFilterParams(e.target.value));
  };
  const handleReset = () => {
    dispatch(setSearchTerm(""));
    dispatch(setFilterParams("all"));
  };

  const handleInputChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
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

export default ProjectBoardSearch;
