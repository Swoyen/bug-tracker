import {
  Grid,
  Paper,
  useTheme,
  IconButton,
  Typography,
  Input,
  Grow,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect } from "react";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLabelName,
  modifyLabel,
  removeLabel,
} from "../../../../store/labels";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import DoneRoundedIcon from "@material-ui/icons/DoneRounded";
import { modifyBug } from "../../../../store/bug";

const useStyles = makeStyles((theme) => ({
  root: {},
  labelEditInput: {
    padding: theme.spacing(0.5),
    fontWeight: 500,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    color: "white",
    fontSize: "14px",
  },
  paper: {
    margin: theme.spacing(0.5),
    cursor: "pointer",
    "&:hover": {
      background: (props) => props.label.color + "cf !important",
    },
  },
}));

const BugDetailsLabelSelectPaper = (props) => {
  const { label, currentEditId, setCurrentEditId } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles(props);
  const [labelText, setLabelText] = useState(label.name);
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(false);
  const loadedBug = useSelector((state) => state.entities.bug.loadedBug);
  const labelName = useSelector(getLabelName(label.labelId));

  useEffect(() => {
    if (currentEditId === label.labelId) setEdit(true);
    else setEdit(false);
  }, [currentEditId, label]);

  useEffect(() => {
    if (loadedBug.labels && loadedBug.labels.length > 0) {
      if (loadedBug.labels.some((l) => l.labelId === label.labelId)) {
        setSelected(true);
      }
    }
  }, [loadedBug.labels, label]);

  const handleEdit = () => {
    if (edit) {
      if (labelText !== label.name) {
        let newLabel = { ...label, name: labelText };
        dispatch(modifyLabel(label.labelId, newLabel)).then((res) => {
          setEdit(false);
        });
      } else {
        setEdit(false);
      }
    } else {
      currentEditId === label.labelId
        ? setEdit(true)
        : setCurrentEditId(label.labelId);
    }
  };

  const handleLabelTextModified = (e) => {
    setLabelText(e.target.value);
  };

  const handleSelected = (e) => {
    var newBug;
    if (!selected) {
      newBug = {
        ...loadedBug,
        labels: [
          ...loadedBug.labels,
          { bugId: loadedBug.bugId, labelId: label.labelId },
        ],
      };

      dispatch(modifyBug(loadedBug.bugId, newBug)).then(() =>
        setSelected(true)
      );
    } else {
      var labels = loadedBug.labels;
      labels = labels.filter((l) => l.labelId !== label.labelId);
      newBug = {
        ...loadedBug,
        labels: labels,
      };
      dispatch(modifyBug(loadedBug.bugId, newBug)).then(() =>
        setSelected(false)
      );
    }
    setSelected((selected) => !selected);
  };

  const handleLabelDelete = (e) => {
    dispatch(removeLabel(label.labelId));
  };

  return (
    <Grid
      container
      item
      xs={12}
      alignItems="center"
      justifyContent="space-around"
    >
      <Grid item xs={10} container>
        <Paper
          className={classes.paper}
          style={{
            background: label.color,
            width: "240px",
          }}
        >
          <Grid container>
            {edit ? (
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={8}>
                  <Input
                    margin="none"
                    value={labelText}
                    autoFocus={true}
                    className={classes.labelEditInput}
                    fullWidth
                    onChange={(e) => handleLabelTextModified(e)}
                  ></Input>
                </Grid>

                <Grid item>
                  <Grow in={edit}>
                    <IconButton
                      size="small"
                      onClick={handleLabelDelete}
                      aria-label="delete"
                    >
                      <HighlightOffRoundedIcon />
                    </IconButton>
                  </Grow>
                </Grid>
              </Grid>
            ) : (
              <Grid
                onClick={() => handleSelected()}
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item>
                  <Typography
                    style={{
                      padding: theme.spacing(1),
                    }}
                    variant="subtitle2"
                    color="secondary"
                  >
                    <b>{labelName}</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <Grow in={selected}>
                    <DoneRoundedIcon
                      style={{
                        marginRight: theme.spacing(0.5),
                        marginTop: theme.spacing(0.5),
                      }}
                      color="secondary"
                    />
                  </Grow>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <IconButton size="small" aria-label="edit" onClick={handleEdit}>
          <EditRoundedIcon
            color={edit ? "primary" : "disabled"}
            fontSize="small"
          />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default BugDetailsLabelSelectPaper;
