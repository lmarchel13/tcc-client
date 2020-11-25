import React from "react";
import Modal from "@material-ui/core/Modal";

import { makeStyles } from "@material-ui/core/styles";
import { blueBg, blueColor } from "../utils/colors";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 800,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ConfirmModal({
  open,
  setOpen,
  title,
  text,
  labels: { yes = "Sim", no = "Não" } = {},
  onSubmit,
}) {
  const classes = useStyles();
  const top = 50;
  const left = 50;

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div
          style={{
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
            display: "flex",
            flexDirection: "column",
          }}
          className={classes.paper}
        >
          <h2 style={{ marginBottom: 32, fontFamily: "Futura" }}>{title}</h2>
          <span style={{ marginBottom: 16 }}>{text}</span>

          <div style={{ width: "60%", display: "flex", margin: "0 auto" }}>
            <Button
              style={{ backgroundColor: blueBg, color: blueColor, width: "40%", margin: "0 auto", marginTop: 16 }}
              onClick={onSubmit}
            >
              {yes}
            </Button>
            <Button
              style={{ backgroundColor: blueBg, color: blueColor, width: "40%", margin: "0 auto", marginTop: 16 }}
              onClick={() => setOpen(false)}
            >
              {no}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
