import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Brightness1 as Brightness1Icon } from "@material-ui/icons";
import React from "react";
import { useSelector } from "react-redux";
import { BASE_URL, RESTRICTEDENDPOINTS } from "../../../api/config";
import { getTotal, getTotalSeverity } from "../../../store/summary";

const SeveritySummaryListItem = ({ severity }) => {
  const theme = useTheme();
  const severityCount = useSelector(getTotalSeverity(severity.severityId));
  return (
    <ListItem key={severity.severityId}>
      <ListItemAvatar>
        <IconButton size="small" aria-label="Button" size="small">
          {/* <Brightness1Icon style={{ fontSize: "10px" }}></Brightness1Icon> */}
          <Avatar
            variant="circular"
            style={{ width: "15px", height: "15px" }}
            src={`${BASE_URL}${RESTRICTEDENDPOINTS.IMAGE}/${severity.iconName}`}
          ></Avatar>
        </IconButton>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="body2">{severity.severityName}</Typography>
        }
      />
      <ListItemSecondaryAction>
        <IconButton variant="circle" aria-label="count" size="small">
          <Avatar
            style={{
              background: theme.palette.primary.main,
              width: "25px",
              height: "25px",
              fontSize: "15px",
            }}
          >
            {severityCount ? severityCount : 0}
          </Avatar>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SeveritySummaryListItem;
