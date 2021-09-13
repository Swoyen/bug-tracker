import {
  Divider,
  IconButton,
  ListItemAvatar,
  ListItemText,
  useTheme,
  Avatar,
  Typography,
  Grid,
  ListItemSecondaryAction,
  ListItem,
  Tooltip,
} from "@material-ui/core";

import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from "@material-ui/icons/Delete";
import ImageRoundedIcon from "@material-ui/icons/ImageRounded";
import InsertDriveFileRoundedIcon from "@material-ui/icons/InsertDriveFileRounded";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { downloadFile } from "../../../../api";
import { BASE_URL, RESTRICTEDENDPOINTS } from "../../../../api/config";
import { modifyBug, setBugAttachmentDeleteShown } from "../../../../store/bug";
import WallpaperRoundedIcon from "@material-ui/icons/WallpaperRounded";

const BugAttachFileListItem = ({ attachment, index, totalLength }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.entities.auth.accessToken);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalDuration, setTotalDuration] = useState("00 : 00");
  const [isPictureExtension, setIsPictureExtension] = useState(false);
  const [title, setTitle] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const [tick, setTick] = useState(0);
  const userId = useSelector((state) => state.entities.auth.userId);
  const loadedBug = useSelector((state) => state.entities.bug.loadedBug);

  useEffect(() => {
    if (attachment.fileName) {
      let fileName = attachment.fileName;
      let extension = fileName.slice(fileName.indexOf(".") + 1);
      let isPicture =
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "gif" ||
        extension === "png";

      if (isPicture) {
        setImgSrc(
          `${BASE_URL}${RESTRICTEDENDPOINTS.IMAGE}/${attachment.fileName}`
        );
      }

      setIsPictureExtension(isPicture);
    }
  }, [attachment.fileName]);

  useEffect(() => {
    if (!attachment.userId || !userId) return;

    setTitle(
      attachment.userId === userId
        ? `You uploaded ${attachment.originalFileName}`
        : `${attachment.userName} uploaded ${attachment.originalFileName}`
    );
  }, [
    attachment.userId,
    attachment.userName,
    attachment.originalFileName,
    userId,
  ]);

  useEffect(() => {
    if (attachment.attachedDate && currentTime !== null) {
      var d = attachment.attachedDate;

      var date = new Date(d.slice(-1) !== "Z" ? d + "Z" : d);
      var a = moment(new Date());
      var b = moment(date);

      var days = a.diff(b, "days", true);
      var hours = parseInt(a.diff(b, "hours", true));
      var mins = parseInt(a.diff(b, "minutes", true) - hours * 60);

      var seconds = parseInt(a.diff(b, "seconds", true) % 60);

      setTotalDuration(
        days >= 1
          ? date.toDateString()
          : `${hours > 0 ? hours + " hours " : ""}${
              mins > 0 ? mins + " mins " : ""
            } ${seconds > 0 ? seconds + " seconds " : ""} ago.`
      );
    }
  }, [attachment.attachedDate, currentTime.getSeconds()]);

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

  const handleShowConfirm = (attachmentId) => {
    dispatch(setBugAttachmentDeleteShown(true, attachmentId));
  };

  const handleDownload = (fileName, originalFileName) => {
    downloadFile(fileName, originalFileName, accessToken);
  };

  const handleSetHeaderBackground = () => {
    let newBug = {
      ...loadedBug,
      headerBackgroundSet: true,
      headerBackgroundImgSrc: attachment.fileName,
    };
    console.log(newBug);
    dispatch(modifyBug(newBug.bugId, newBug, false));
  };

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          {isPictureExtension ? (
            <Avatar variant="rounded" src={imgSrc} alt="avatar">
              <ImageRoundedIcon />
            </Avatar>
          ) : (
            <Avatar>
              <InsertDriveFileRoundedIcon />
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Typography
                  style={{ marginRight: theme.spacing(1) }}
                  variant="subtitle2"
                  color="initial"
                >
                  {title}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Tooltip title="Download" placement="top">
                  <IconButton
                    size="small"
                    aria-label="download"
                    onClick={() =>
                      handleDownload(
                        attachment.fileName,
                        attachment.originalFileName
                      )
                    }
                  >
                    <CloudDownloadIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={2}>
                {isPictureExtension ? (
                  <Tooltip title="Set Header" placement="top">
                    <IconButton
                      size="small"
                      aria-label="Set Header"
                      onClick={() => handleSetHeaderBackground()}
                    >
                      <WallpaperRoundedIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          }
          secondary={`Uploaded: ${totalDuration}`}
        />
        <ListItemSecondaryAction>
          <Tooltip title="Delete" placement="top">
            <IconButton
              aria-label="remove-attachment"
              onClick={() => handleShowConfirm(attachment.attachmentId)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      {index < totalLength - 1 ? <Divider /> : ""}
    </>
  );
};

export default BugAttachFileListItem;
