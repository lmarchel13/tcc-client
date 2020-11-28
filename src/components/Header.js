import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

import SearchBar from "./SearchBar";
import { blueBg, blueColor } from "../utils/colors";
import logo from "../assets/logo.png";

const Header = ({ loggedIn }) => {
  const links = [
    { to: "/categories", text: "Categorias" },
    { to: "/offers", text: "Ofertas do dia" },
    { to: "/transactions", text: "Histórico" },
    { to: "/companies", text: "Anunciantes" },
  ];

  return (
    <div
      style={{
        height: 100,
        width: "100%",
        backgroundColor: blueBg,
        display: "flex",
        flex: 1,
        justifyContent: "center",
        boxShadow: "0 1px 0 0 rgba(0,0,0,.1)",
      }}
    >
      <div style={{ alignSelf: "flex-end", marginRight: 100 }}>
        <img src={logo} alt="Logo" height="100" width="300" />
      </div>
      <div style={{ marginRight: 100, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <SearchBar placeholder="Buscar serviços..." />
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly", marginBottom: 15 }}>
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
      <div style={{ alignSelf: "flex-end", marginBottom: 15 }}>
        {/* User not logged in */}
        {!loggedIn && (
          <div>
            <NavLink
              to="/signup"
              exact
              style={{
                textDecoration: "none",
                color: blueColor,
                marginLeft: 10,
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
                marginLeft: 10,
                fontFamily: "Futura",
              }}
            >
              Entrar
            </NavLink>
          </div>
        )}
        {/* User logged in */}
        {loggedIn && (
          <div>
            <NavLink
              to="/profile"
              exact
              style={{
                textDecoration: "none",
                color: blueColor,
                marginRight: 10,
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
                marginLeft: 10,
                fontFamily: "Futura",
              }}
            >
              Sair
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser, loggedIn: authedUser && !!authedUser.jwt && !!authedUser.userId };
};

export default connect(mapStateToProps)(Header);
