import React, { useContext } from "react";
import { Link, useRouteMatch } from "react-router-dom";

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
import BugReportIcon from "@material-ui/icons/BugReport";
import AccountTreeIcon from "@material-ui/icons/AccountTree";

import { ProjectContext } from "../../context/ProjectContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    background: "yellow",
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 10,
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
  headingIcon: {
    paddingRight: theme.spacing(0),
  },
  listContent: {
    paddingLeft: theme.spacing(4),
  },
}));

const ProjectSideBar = () => {
  const { url, path } = useRouteMatch();
  const classes = useStyles();
  const { projectName, setProjectName } = useContext(ProjectContext);

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
              primary={projectName}
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
                primary={"Bugs"}
              />
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  );
};

export default ProjectSideBar;
