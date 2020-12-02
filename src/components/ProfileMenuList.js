import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
  },
}));

const ProfileMenuList = ({ tabs, setTab, style = {} }) => {
  const classes = useStyles();

  return (
    <div className={classes.root} style={style}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button onClick={() => setTab(tabs.PROFILE)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Editar" />
        </ListItem>
        <ListItem button onClick={() => setTab(tabs.COMPANIES)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Minhas empresas" />
        </ListItem>
        <ListItem button onClick={() => setTab(tabs.TRANSACTIONS)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Histórico" />
        </ListItem>
        <ListItem button onClick={() => setTab(tabs.MESSAGES)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Mensagens" />
        </ListItem>
      </List>
      <Divider />
    </div>
  );
};

export default ProfileMenuList;
