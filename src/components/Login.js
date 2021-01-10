import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Paper, Button, TextField, Divider } from "@material-ui/core";
import { GoogleLogin } from "react-google-login";
import { io } from "socket.io-client";

import SnackBar from "./SnackBar";
import { blueBg, blueColor } from "../utils/colors";
import { API, Cache } from "../providers";
import { setAuthedUser } from "../actions/authedUser";

import config from "../config";
import { defineWebSocket } from "../actions/webSocket";

const socket = io(config.API_BASE_URL);

const Login = ({ dispatch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const history = useHistory();

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    resetSnackBarState();

    const payload = { email, password };
    const { err, data } = await API.login(payload);

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(true);
    } else {
      const { userId, jwt, userCompanies } = data;

      Cache.setToken(jwt);
      Cache.setUserId(userId);
      Cache.setUserCompanies(userCompanies);

      socket.emit("join", userId);
      dispatch(setAuthedUser({ userId, jwt, userCompanies }));
      dispatch(defineWebSocket(socket));

      history.push("/");
    }
  };

  const onSuccess = async ({ googleId }) => {
    const { err, data } = await API.login({ googleId });

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(true);
    } else {
      const { userId, jwt, userCompanies } = data;

      Cache.setToken(jwt);
      Cache.setUserId(userId);
      Cache.setUserCompanies(userCompanies);

      dispatch(setAuthedUser({ userId, jwt, userCompanies }));

      history.push("/");
    }
  };

  const onFailure = (err) => {
    console.error("onFailure error:", err);
    setSnackBarData({ text: "Credenciais inválidas", severity: "error" });
    setOpenSnackBar(true);
  };

  return (
    <Fragment>
      <div style={{ width: "100%", margin: "0 auto", marginTop: 64 }}>
        <form noValidate autoComplete="off" onSubmit={onSubmit}>
          <Paper elevation={3} style={{ width: 800, height: 550, margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontFamily: "Futura", color: blueColor, paddingTop: 32 }}>
              Olá! Digite o seu e-mail e senha
            </h2>
            <div style={{ width: "90%", margin: "0 auto", padding: 32, display: "flex", flexDirection: "column" }}>
              <TextField
                name="email"
                label="E-mail"
                type="email"
                style={{ flex: 1, margin: 16 }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
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
                style={{ backgroundColor: blueBg, width: "100%", color: blueColor, marginBottom: 32 }}
                type="submit"
              >
                Entrar
              </Button>
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
                  // clientId="527214406910-5rkm3vv611cftn5o8969539m3dreg6t6.apps.googleusercontent.com"
                  clientId={config.GOOGLE_CLIENT_ID}
                  buttonText="Entre com o Google"
                  onSuccess={(response) => onSuccess(response)}
                  onFailure={(err) => onFailure(err)}
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

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(Login);
