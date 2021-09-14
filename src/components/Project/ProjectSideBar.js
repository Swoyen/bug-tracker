import React, { useContext, useEffect, useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";

import {
  Drawer,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Avatar,
} from "@material-ui/core";
import BugReportIcon from "@material-ui/icons/BugReport";
import WebAssetTwoToneIcon from "@material-ui/icons/WebAssetTwoTone";
import TimerRoundedIcon from "@material-ui/icons/TimerRounded";
import DoneOutlineRoundedIcon from "@material-ui/icons/DoneOutlineOutlined";
import AssessmentIcon from "@material-ui/icons/Assessment";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import { NavContext } from "../../context/NavContext";
import { useSelector } from "react-redux";
import { BASE_URL, RESTRICTEDENDPOINTS } from "../../api/config";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    // background: "",
    // width: drawerWidth,
    // flexShrink: 0,
    // zIndex: 10,
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth - 40,
    paddingTop: theme.spacing(10),
    paddingLeft: "10px",
    paddingRight: "10px",
    // background: "#f2f2f2",
    background: theme.palette.secondary.light,
    zIndex: 10,
  },
  // drawerPaper: {
  //   width: drawerWidth,
  // },
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

const drawer = (url, classes, imgSrc, projectName, projectCreator) => {
  return (
    <div className={classes.drawerContainer}>
      <List>
        <ListItem disabled className={classes.l} button>
          <ListItemIcon className={classes.headingIcon}>
            <Avatar variant="rounded" src={imgSrc} />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ style: { fontSize: "1em" } }}
            primary={projectName}
            secondary={"Created by: " + projectCreator}
          />
        </ListItem>
        <Link className={classes.routerlink} to={`${url}/summary`}>
          <ListItem className={classes.listContent} dense button>
            <ListItemIcon>
              <AssignmentRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
              dense="true"
              primary={"Summary"}
            />
          </ListItem>
        </Link>
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
        <Link className={classes.routerlink} to={`${url}/resolved`}>
          <ListItem className={classes.listContent} dense button>
            <ListItemIcon>
              <DoneOutlineRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
              dense="true"
              primary={"Resolved"}
            />
          </ListItem>
        </Link>
        <Link className={classes.routerlink} to={`${url}/report`}>
          <ListItem className={classes.listContent} dense button>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ style: { fontSize: "0.95em" } }}
              dense="true"
              primary={"Report"}
            />
          </ListItem>
        </Link>
      </List>
    </div>
  );
};

const ProjectSideBar = (props) => {
  const { window } = props;
  const { url } = useRouteMatch();
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useContext(NavContext);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const project = useSelector((state) => state.entities.projects.loadedProject);

  const [values, setValues] = useState({});
  useEffect(() => {
    if (Object.keys(project).length > 0) {
      setValues({
        projectName: project.title,
        projectImgSrc: `${BASE_URL}${RESTRICTEDENDPOINTS.IMAGE}/${project.imageName}`,
        creatorName: project.creator.userName,
      });
    }
  }, [project]);
  // url, classes, imgSrc, projectName, projectCreator
  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          //className={classes.root}
          variant="temporary"
          classes={{ paper: classes.drawerPaper }}
          onClose={handleDrawerToggle}
          open={mobileOpen}
          ModalProps={{ keepMounted: true }}
        >
          {/* <Toolbar /> */}
          {drawer(
            url,
            classes,
            values.projectImgSrc,
            values.projectName,
            values.creatorName
          )}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer(
            url,
            classes,
            values.projectImgSrc,
            values.projectName,
            values.creatorName
          )}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default ProjectSideBar;
