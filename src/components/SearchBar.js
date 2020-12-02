import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 600,
    height: 35,
    marginTop: 10,
  },
  input: {
    marginLeft: theme.spacing(2),
    fontSize: 14,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const defineOnClickFn = () => {
  console.log("onClick function não existe");
};

const SearchBar = ({ placeholder = "", onClick = defineOnClickFn, style = {}, term, setTerm }) => {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root} style={{ backgroundColor: "#F6F9FD", ...style }} elevation={3}>
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") onClick(e);
        }}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton className={classes.iconButton} aria-label="search" onClick={onClick}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
