import {
  Grid,
  Typography,
  TextField,
  Box,
  makeStyles,
  Button,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { useState } from "react";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addLabel } from "../../../../store/labels";
import Form from "../../../../layouts/Form";

const colors = [
  { id: 1, color: "#fc8c84" },
  { id: 2, color: "#6454ac" },
  { id: 3, color: "#5bc0de" },
  { id: 4, color: "#1abc9c" },
  { id: 5, color: "#029658" },
  { id: 6, color: "#8cc43c" },
  { id: 7, color: "#f6c700" },
  { id: 8, color: "#fc6404" },
  { id: 9, color: "#60962e" },
  { id: 10, color: "#4d7902" },
  { id: 11, color: "#104a8e" },
  { id: 12, color: "#d18780" },
];

const useStyles = makeStyles((theme) => ({
  box: {
    height: "30px",
    borderRadius: "5px",
    margin: theme.spacing(0.5),
    width: "40px",
    display: "inline-block",
    cursor: "pointer",
    textAlign: "center",
    overflow: "hidden",
  },
  tickContainer: {
    height: "100%",
    width: "100%",
    "&:hover": {
      background: "rgba(0,0,0,0.1)",
    },
  },
  tick: { marginTop: theme.spacing(0.2) },
}));

const BugDetailsLabelCreateLabel = ({ goBack }) => {
  const [values, setValues] = useState({
    labelName: "",
    selectedLabelColorId: 0,
  });

  const [errors, setErrors] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleAdd = (e) => {
    e.preventDefault();
    if (validate()) {
      let label = {
        labelId: 0,
        name: values.labelName,
        color: colors.find((color) => color.id === values.selectedLabelColorId)
          .color,
      };
      dispatch(addLabel(label))
        .then(() => goBack())
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    validateField("labelName", "", "This field is required.");
  }, [values.labelName]);

  useEffect(() => {
    validateField("selectedLabel", 0, "Choose an option.");
  }, [values.selectedLabelColorId]);
  const handleLabelTextChange = (e) => {
    setValues((values) => {
      return { ...values, labelName: e.target.value };
    });
  };

  const handleLabelColorChange = (id) => {
    setValues((values) => {
      return { ...values, selectedLabelColorId: id };
    });
  };

  useEffect(() => {
    setErrors([]);
    return () => {
      setErrors([]);
    };
  }, []);

  const validateField = (field, comp, msg) => {
    let temp = { ...errors };
    temp[field] = values[field] !== comp ? "" : msg;
    setErrors({ ...temp });
  };

  const validate = () => {
    let temp = {};
    temp.labelName = values.labelName !== "" ? "" : "This field is required.";
    temp.selectedLabel =
      values.selectedLabelColorId !== 0 ? "" : "Choose an option.";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  return (
    <Grid container spacing={1}>
      <Form onSubmit={(e) => handleAdd(e)}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="initial">
            Name
          </Typography>
          <TextField
            fullWidth
            id="label-name"
            label={errors.labelName}
            error={errors.labelName !== undefined && errors.labelName !== ""}
            value={values.labelName}
            onChange={(e) => handleLabelTextChange(e)}
            style={{ marginBottom: theme.spacing(2) }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="initial">
            Select Color
          </Typography>
          {colors.map((color) => (
            <Box
              key={color.id}
              className={classes.box}
              style={{ background: color.color }}
              onClick={() => handleLabelColorChange(color.id)}
            >
              <div className={classes.tickContainer}>
                {values.selectedLabelColorId === color.id ? (
                  <CheckRoundedIcon className={classes.tick} />
                ) : (
                  ""
                )}
              </div>
            </Box>
          ))}
          <Typography variant="subtitle2" color="error">
            {errors.selectedLabel}
          </Typography>
        </Grid>
        <Grid style={{ paddingTop: theme.spacing(1) }} item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Grid>
      </Form>
    </Grid>
  );
};

export default BugDetailsLabelCreateLabel;
