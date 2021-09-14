import { Paper, Tab } from "@material-ui/core";
import { Tabs } from "@material-ui/core";
import React, { useState } from "react";
import BugComment from "../../Comment/BugComment";
import BugDetailActivitiesTabPanel from "./BugDetailActivitiesTabPanel";
import CommentRoundedIcon from "@material-ui/icons/CommentRounded";
import TimerRoundedIcon from "@material-ui/icons/TimerRounded";
import BugTimeTrack from "./BugTimeTrack";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import BugAttachFile from "./BugAttachFile";
const BugDetailsActivitiesTab = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  return (
    <>
      <Paper position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<CommentRoundedIcon />} {...a11yProps(0)} />
          <Tab icon={<TimerRoundedIcon />} {...a11yProps(1)} />
          <Tab icon={<AttachFileRoundedIcon />} {...a11yProps(2)} />
        </Tabs>
      </Paper>
      <BugDetailActivitiesTabPanel value={value} index={0}>
        <BugComment />
      </BugDetailActivitiesTabPanel>
      <BugDetailActivitiesTabPanel value={value} index={1}>
        <BugTimeTrack />
      </BugDetailActivitiesTabPanel>
      <BugDetailActivitiesTabPanel value={value} index={2}>
        <BugAttachFile />
      </BugDetailActivitiesTabPanel>
      {/* <BugDetailActivitiesTabPanel value={value} index={2}>
        Item Three
      </BugDetailActivitiesTabPanel> */}
    </>
  );
};

export default BugDetailsActivitiesTab;
