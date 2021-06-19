import {
  Drawer,
  makeStyles,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import { Inbox as InboxIcon, Mail as MailIcon } from "@material-ui/icons";
import React from "react";
import BugReportIcon from "@material-ui/icons/BugReport";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth - 40,
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  routerlink: {
    textDecoration: "none",
    color: "inherit",
  },
}));

const SideBar = () => {
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
          <Link className={classes.routerlink} to="/bugs">
            <ListItem dense className={classes.l} button>
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
                dense="true"
                primary={"Bugs"}
              />
            </ListItem>
            <ListItem dense className={classes.l} button>
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
                dense="true"
                primary={"Bugs"}
              />
            </ListItem>
            <ListItem dense className={classes.l} button>
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
                dense="true"
                primary={"Bugs"}
              />
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  );
};

export default SideBar;
