import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";

import SearchBar from "./SearchBar";
import SnackBar from "./SnackBar";

import { blueBg, blueColor } from "../utils/colors";
import logo from "../assets/logo.png";
import { API } from "../providers";

const links = [
  { to: "/categories", text: "Categorias" },
  { to: "/offers", text: "Ofertas do dia" },
  { to: "/companies", text: "Anunciantes" },
  // { to: "/transactions", text: "Histórico" },
];

const Header = ({ loggedIn }) => {
  const history = useHistory();

  const [term, setTerm] = useState("");

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const search = async (e) => {
    e.preventDefault();

    if (!term) return;

    const { data, err } = await API.searchServices(term);

    if (err) {
      resetSnackBarState();
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(true);
      return;
    }

    if (data.length === 0) {
      resetSnackBarState();
      setSnackBarData({ text: "Nenhum serviço encontrado", severity: "error" });
      setOpenSnackBar(true);
      return;
    }

    setTerm("");

    history.push("/services", { services: data });
  };

  return (
    <Fragment>
      <div
        style={{
          height: 100,
          backgroundColor: blueBg,
          display: "flex",
          flex: 1,
          justifyContent: "center",
          boxShadow: "0 1px 0 0 rgba(0,0,0,.1)",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
          <img
            src={logo}
            alt="Logo"
            height="100"
            width="300"
            onClick={() => {
              history.push("/");
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
        {/* Menu */}
        <div
          style={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SearchBar placeholder="Buscar serviços..." onClick={search} term={term} setTerm={setTerm} />
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "space-evenly", marginTop: 16 }}>
            {links.map(({ to, text }) => {
              return (
                <div key={to}>
                  <NavLink
                    to={to}
                    exact
                    style={{
                      color: blueColor,
                      textDecoration: "none",
                      flex: 1,
                      fontFamily: "Futura",
                    }}
                  >
                    {text}
                  </NavLink>
                </div>
              );
            })}
          </div>
        </div>
        {/* Access control */}
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
            flexDirection: "column",
          }}
        >
          {/* User not logged in */}
          {!loggedIn && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: 16,
              }}
            >
              <NavLink
                to="/signup"
                exact
                style={{
                  textDecoration: "none",
                  color: blueColor,
                  marginLeft: 16,
                  fontFamily: "Futura",
                }}
              >
                Crie a sua conta
              </NavLink>
              <NavLink
                to="/signin"
                exact
                style={{
                  textDecoration: "none",
                  color: blueColor,
                  marginLeft: 16,
                  fontFamily: "Futura",
                }}
              >
                Entrar
              </NavLink>
            </div>
          )}
          {/* User logged in */}
          {loggedIn && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
              <NavLink
                to="/profile"
                exact
                style={{
                  textDecoration: "none",
                  color: blueColor,
                  marginRight: 16,
                  fontFamily: "Futura",
                }}
              >
                Perfil
              </NavLink>
              <NavLink
                to="/signout"
                exact
                style={{
                  textDecoration: "none",
                  color: blueColor,
                  marginLeft: 16,
                  fontFamily: "Futura",
                }}
              >
                Sair
              </NavLink>
            </div>
          )}
        </div>
      </div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser, loggedIn: authedUser && !!authedUser.jwt && !!authedUser.userId };
};

export default connect(mapStateToProps)(Header);
