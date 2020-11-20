import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as EmailValidator from "email-validator";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SnackBar from "./SnackBar";

import { blueBg, blueColor } from "../utils/colors";
import { API } from "../providers";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formIsValid, setFormIsValid] = useState(false);
  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const history = useHistory();

  const validateEmail = () => {
    return EmailValidator.validate(email);
  };

  const validatePassword = () => {
    return password.length >= 6 && password.length <= 20;
  };

  useEffect(() => {
    if (firstName && lastName && validateEmail() && validatePassword()) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [firstName, lastName, email, password, validateEmail, validatePassword]);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    resetSnackBarState();
    if (!formIsValid) return;

    const payload = { firstName, lastName, email, password };
    const { err } = await API.register(payload);

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(true);
    } else {
      history.push("/login");
    }
  };

  return (
    <div style={{ width: "30%", margin: "0 auto", height: 500, marginTop: 32 }}>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />

      <form noValidate autoComplete="off" onSubmit={onSubmit}>
        <Paper style={{ width: 800, height: 350 }}>
          <h2 style={{ textAlign: "center", fontFamily: "Futura", color: blueColor, paddingTop: 32 }}>
            Preencha seus dados
          </h2>
          <div style={{ width: "90%", margin: "0 auto", padding: 32 }}>
            <div style={{ display: "flex", marginBottom: 32 }}>
              <TextField
                name="firstName"
                label="Nome"
                style={{ flex: 1, margin: 16 }}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <TextField
                name="lastName"
                label="Sobrenome"
                style={{ flex: 1, margin: 16 }}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
            <div style={{ display: "flex", marginTop: 32 }}>
              <TextField
                error={!!email && !validateEmail()}
                helperText={email && !validateEmail() && "E-mail inválido"}
                name="email"
                label="E-mail"
                type="email"
                style={{ flex: 1, margin: 16 }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                error={!!password && !validatePassword()}
                helperText={password && !validatePassword() && "Use de 6 a 20 caracteres"}
                name="password"
                label="Senha"
                type="password"
                style={{ flex: 1, margin: 16 }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
        </Paper>
        <div style={{ width: "80%", margin: "0 auto" }}>
          <Button
            variant="contained"
            size="large"
            style={{ marginTop: 32, backgroundColor: blueBg, width: "100%", color: blueColor }}
            type="submit"
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(Register);
