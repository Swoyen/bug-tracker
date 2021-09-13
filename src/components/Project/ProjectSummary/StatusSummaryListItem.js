import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React from "react";
import { useSelector } from "react-redux";
import { getTotalStatus } from "../../../store/summary";

const StatusSummaryListItem = ({ status }) => {
  const theme = useTheme();
  const statusCount = useSelector(getTotalStatus(status.statusId));
  return (
    <ListItem key={status.statusId}>
      <ListItemAvatar>
        <IconButton variant="circle" aria-label="count" size="small">
          <Avatar style={{ width: "15px", height: "15px", fontSize: "15px" }}>
            .
          </Avatar>
        </IconButton>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={<Typography variant="body2">{status.statusName}</Typography>}
      />
      <ListItemSecondaryAction>
        <IconButton variant="circle" aria-label="count" size="small">
          <Avatar
            style={{
              width: "25px",
              height: "25px",
              fontSize: "15px",
              background: theme.palette.primary.main,
            }}
          >
            {statusCount ? statusCount : 0}
          </Avatar>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default StatusSummaryListItem;
