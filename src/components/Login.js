import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import SnackBar from "./SnackBar";
import { blueBg, blueColor } from "../utils/colors";
import { API, Cache } from "../providers";
import { setAuthedUser } from "../actions/authedUser";

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
      const { userId, jwt } = data;

      dispatch(setAuthedUser(userId));
      Cache.setToken(jwt);

      history.push("/");
    }
  };

  return (
    <div style={{ width: "30%", margin: "0 auto", height: 500, marginTop: 32 }}>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
      <form noValidate autoComplete="off" onSubmit={onSubmit}>
        <Paper style={{ height: 300 }}>
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

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(Login);
