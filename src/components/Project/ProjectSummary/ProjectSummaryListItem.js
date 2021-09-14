import {
  Avatar,
  Collapse,
  Divider,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { ListItem } from "@material-ui/core";
import ImageRoundedIcon from "@material-ui/icons/ImageRounded";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";

const ProjectSummaryListItem = ({
  action,
  createDivider,
  isCollapsed = true,
}) => {
  const [duration, setDuration] = useState("00");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (action.dateTime && currentTime) {
      var d = action.dateTime;

      var date = new Date(d.slice(-1) !== "Z" ? d + "Z" : d);
      var a = moment(new Date());
      var b = moment(date);

      var days = a.diff(b, "days", true);
      var hours = parseInt(a.diff(b, "hours", true));
      var mins = parseInt(a.diff(b, "minutes", true) - hours * 60);

      var seconds = parseInt(a.diff(b, "seconds", true) % 60);
      const duration =
        days >= 1
          ? date.toDateString()
          : `${hours > 0 ? hours + " hours " : ""}${
              mins > 0 ? mins + " mins " : ""
            } ${mins <= 0 ? seconds + " seconds " : ""}ago.`;
      setDuration(duration);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, currentTime, currentTime.getSeconds()]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setTimeout(() => {
        if (mounted) {
          setCurrentTime(new Date());
          setTick(tick + 1);
        }
      }, 1000);
    }
    return () => (mounted = false);
  }, [tick]);

  useEffect(() => {
    setCollapsed(true);
  }, []);
  return (
    <>
      <Collapse in={collapsed} collapsedSize={0}>
        <ListItem>
          <ListItemAvatar>
            <Avatar variant="circular">
              <ImageRoundedIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={
              !action.before ? (
                action.after ? (
                  <>
                    <b>{action.userName}</b> {action.event} named
                    <b>{" " + action.after}</b> in{" "}
                    <b>Bug {" " + action.bugId}</b>
                  </>
                ) : (
                  <>
                    <b>{action.userName}</b> {action.event} in
                    <b> Bug {" " + action.bugId}</b>
                  </>
                )
              ) : (
                <>
                  <b>{action.userName}</b> {action.event} from{" "}
                  <b>{" " + action.before}</b> to <b>{" " + action.after}</b> in{" "}
                  <b>Bug {" " + action.bugId}</b>
                </>
              )
            }
            secondary={`${duration}`}
          />
        </ListItem>
      </Collapse>
      {createDivider ? <Divider variant="fullWidth" /> : ""}
    </>
  );
};

export default ProjectSummaryListItem;
