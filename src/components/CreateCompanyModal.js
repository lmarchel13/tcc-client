import React from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

const top = 50;
const left = 50;

const modalStyle = {
  top: `${top}%`,
  left: `${left}%`,
  transform: `translate(-${top}%, -${left}%)`,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function CreateCompanyModal({ open, setOpen, userId }) {
  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
