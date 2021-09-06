import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import * as EmailValidator from "email-validator";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

import { Paper, TextField, Button, Divider } from "@material-ui/core";

import SnackBar from "./SnackBar";

import { blueBg, blueColor } from "../utils/colors";
import { API } from "../providers";
import config from "../config";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName, email, password]);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    resetSnackBarState();

    if (!formIsValid) {
      setSnackBarData({ text: "Preencha todos os campos", severity: "error" });
      setOpenSnackBar(true);
      return;
    }

    const payload = { firstName, lastName, email, password };
    const { err } = await API.register(payload);

    if (err) {
      setSnackBarData({ text: err.description || "Um erro occoreu durante o cadastro", severity: "error" });
      setOpenSnackBar(true);
      return;
    }

    history.push("/signin");
  };

  const onSuccess = async (response) => {
    const {
      profileObj: { email, familyName: lastName, givenName: firstName, googleId },
    } = response;

    const payload = {
      firstName,
      lastName,
      email,
      googleId,
    };

    const { err } = await API.register(payload);

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(true);
    } else {
      const { err } = await API.login({ googleId });
      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      } else {
        history.push("/signin");
      }
    }
  };

  const onFailure = (err) => {
    console.error("onFailure error:", err);

    setSnackBarData({
      text: "Não foi possível logar com seu email do Google. Por favor, tente novamente",
      severity: "error",
    });
    setOpenSnackBar(true);
  };

  return (
    <Fragment>
      <div style={{ width: "100%", margin: "0 auto", height: 500, marginTop: 64 }}>
        <form noValidate autoComplete="off" onSubmit={onSubmit}>
          <Paper style={{ width: 800, height: 600, margin: "0 auto" }} elevation={3}>
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
              <div style={{ width: "40%", margin: "0 auto" }}>
                <Button
                  variant="contained"
                  size="large"
                  style={{ marginTop: 32, backgroundColor: blueBg, width: "100%", color: blueColor }}
                  type="submit"
                >
                  Enviar
                </Button>
              </div>
            </div>
            <Divider orientation="horizontal" style={{ width: "80%", margin: "0 auto" }} />
            <h2 style={{ textAlign: "center", fontFamily: "Futura", color: blueColor, paddingTop: 32 }}>Ou</h2>
            <div
              style={{
                width: "90%",
                margin: "0 auto",
                padding: 32,
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", marginBottom: 32, margin: "0 auto" }}>
                <GoogleLogin
                  clientId={config.GOOGLE_CLIENT_ID}
                  buttonText="Registre-se com o Google"
                  onSuccess={(res) => onSuccess(res)}
                  onFailure={(e) => onFailure(e)}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
            </div>
          </Paper>
        </form>
      </div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(Register);
