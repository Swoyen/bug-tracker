import React, { useState } from "react";
import { Grid, makeStyles, Select, Typography } from "@material-ui/core";
import { FormControl } from "@material-ui/core";

// import {  createFilterOptions } from "@material-ui/lab";
import Autocomplete from "../../controls/Autocomplete";
import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { createAuthenticatedEndPoint, RESTRICTEDENDPOINTS } from "../../api";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const TimeBugTagSelect = (props) => {
  const classes = useStyles();
  const { instance, accounts } = useMsal();
  const { value, setValue } = props;

  const [tags, setTags] = useState([]);

  const addTag = async (tagName) => {
    const newTag = { bugTagId: "0", bugTagName: tagName };
    const apiObj = await createAuthenticatedEndPoint(
      instance,
      accounts,
      RESTRICTEDENDPOINTS.TAGS
    );
    let result = await apiObj.create(newTag);

    let data = result.data;
    setTags((tags) => {
      return [...tags, data];
    });
    return data;
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      (async () => {
        if (instance && accounts) {
          const apiObj = await createAuthenticatedEndPoint(
            instance,
            accounts,
            RESTRICTEDENDPOINTS.TAGS
          );
          let result = apiObj.fetchAll();
          result
            .then((res) => {
              if (mounted) {
                let data = res.data;
                var newTags = [];
                if (data.length > 0) {
                  data.forEach((tag) =>
                    newTags.push({
                      bugTagId: tag.bugTagId,
                      bugTagName: tag.bugTagName,
                    })
                  );
                  // console.log("nt", newTags);
                  setTags(newTags);
                  // console.log(value);
                }
              }
            })
            .catch((err) => console.log(err));
        }
      })();
    }
    return () => (mounted = false);
  }, [instance, accounts]);

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <Autocomplete
              label="Tags"
              id="tags"
              options={tags}
              addOption={addTag}
              title="bugTagName"
              value={value}
              setValue={setValue}
            ></Autocomplete>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default TimeBugTagSelect;
