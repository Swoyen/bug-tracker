import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

import {
  Drawer,
  makeStyles,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import BugReportIcon from "@material-ui/icons/BugReport";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import WebAssetTwoToneIcon from "@material-ui/icons/WebAssetTwoTone";
import TimerRoundedIcon from "@material-ui/icons/TimerRounded";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    background: "",
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 10,
  },
  drawerPaper: {
    width: drawerWidth - 40,
    paddingLeft: "10px",
    paddingRight: "10px",
    background: "#f2f2f2",
  },
  routerlink: {
    textDecoration: "none",
    color: "inherit",
  },
  headingIcon: {
    paddingRight: theme.spacing(0),
  },
  listContent: {
    paddingLeft: theme.spacing(4),
  },
}));

const ProjectSideBar = () => {
  const { url } = useRouteMatch();
  const classes = useStyles();

  return (
    <Drawer
      className={classes.root}
      variant="permanent"
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {/* {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
          <ListItem disabled className={classes.l} button>
            <ListItemIcon className={classes.headingIcon}>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ style: { fontSize: "1em" } }}
              primary={"hello"}
              secondary={"sad"}
            />
          </ListItem>
          <Link className={classes.routerlink} to={`${url}/bugs`}>
            <ListItem className={classes.listContent} dense button>
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
                dense="true"
                primary={"Issues"}
              />
            </ListItem>
          </Link>
          <Link className={classes.routerlink} to={`${url}/board`}>
            <ListItem className={classes.listContent} dense button>
              <ListItemIcon>
                <WebAssetTwoToneIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
                dense="true"
                primary="Board"
              />
            </ListItem>
          </Link>
          <Link className={classes.routerlink} to={`${url}/time`}>
            <ListItem className={classes.listContent} dense button>
              <ListItemIcon>
                <TimerRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
                dense="true"
                primary={"Timer"}
              />
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  );
};

export default ProjectSideBar;
