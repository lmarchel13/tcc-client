import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function TimePickers({ label, time, setTime }) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id={`${label}-timepicker`}
        label={label}
        type="time"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{ step: 600 }}
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
    </form>
  );
}
