import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";

import SnackBar from "./SnackBar";

import { API } from "../providers";

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

// const DEFAULT_PASSWORD = "**************";
const DEFAULT_PASSWORD = "";

const UpdateProfileModal = ({ open, setOpen, user, authedUser }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(DEFAULT_PASSWORD);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [reset, setReset] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const classes = useStyles();
  const top = 50;
  const left = 50;

  const onSubmit = async () => {
    try {
      if (!firstName || !lastName || !email) throw new Error("Preencha todos os dados");

      const payload = { firstName, lastName, email };

      if (password !== DEFAULT_PASSWORD) payload.password = password;

      const { err } = await API.updateUser(payload, authedUser.jwt);

      resetSnackBarState();

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      } else {
        setOpen(false);
        setSnackBarData({ text: "Perfil atualizado com sucesso", severity: "success" });
        setOpenSnackBar(true);
      }
    } catch (error) {
      setSnackBarData({ text: error.message, severity: "error" });
      setOpenSnackBar(true);
    }

    setPassword(DEFAULT_PASSWORD);
  };

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);

    setPassword(DEFAULT_PASSWORD);

    setReset(false);
  }, [user, reset]);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setReset(true);
        }}
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
          <h2 style={{ marginBottom: 32, fontFamily: "Futura" }}>Editar dados</h2>

          <div style={{ display: "flex", flex: 1, width: "100%", margin: 8 }}>
            <TextField
              label="Nome"
              style={{ flex: 1 }}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%", margin: 8 }}>
            <TextField
              label="Sobrenome"
              style={{ flex: 1 }}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%", margin: 8 }}>
            <TextField
              label="E-mail"
              style={{ flex: 1, marginRight: 8 }}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
              value={email}
            />
          </div>
          <div style={{ display: "flex", flex: 1, width: "100%", margin: 8 }}>
            <TextField
              label="Nova senha"
              style={{ flex: 1, marginRight: 8 }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              InputLabelProps={{ shrink: true }}
              value={password}
              onClick={() => {
                if (password === DEFAULT_PASSWORD) {
                  setPassword("");
                }
              }}
            />
          </div>

          <Button
            style={{ backgroundColor: blueBg, color: blueColor, width: "70%", margin: "0 auto", marginTop: 16 }}
            onClick={onSubmit}
          >
            Atualizar
          </Button>
        </div>
      </Modal>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </div>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(UpdateProfileModal);
