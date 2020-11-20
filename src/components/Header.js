import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import SearchBar from "./SearchBar";
import { blueBg, blueColor } from "../utils/colors";
import logo from "../assets/logo.png";

const Header = ({ authedUser }) => {
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
        <div style={{}}>
          <SearchBar />
        </div>
        <div style={{ display: "flex", justifyContent: "space-evenly", marginBottom: 15 }}>
          <div>
            <Link
              style={{ color: blueColor, textDecoration: "none", flex: 1, fontFamily: "Futura" }}
              href="#"
              onClick={() => {}}
            >
              Categorias
            </Link>
          </div>
          <div>
            <Link
              style={{ color: blueColor, textDecoration: "none", flex: 1, fontFamily: "Futura" }}
              href="#"
              onClick={() => {}}
            >
              Ofertas do dia
            </Link>
          </div>
          <div>
            <Link
              style={{ color: blueColor, textDecoration: "none", flex: 1, fontFamily: "Futura" }}
              href="#"
              onClick={() => {}}
            >
              Histórico
            </Link>
          </div>
          <div>
            <Link
              style={{ color: blueColor, textDecoration: "none", flex: 1, fontFamily: "Futura" }}
              href="#"
              onClick={() => {}}
            >
              Lojas
            </Link>
          </div>
          <div>
            <Link
              style={{ color: blueColor, textDecoration: "none", flex: 1, fontFamily: "Futura" }}
              href="#"
              onClick={() => {}}
            >
              Vender
            </Link>
          </div>
        </div>
      </div>
      <div style={{ alignSelf: "flex-end", marginBottom: 15 }}>
        {!authedUser && (
          <NavLink to="/signup" exact style={{ textDecoration: "none" }}>
            <Link style={{ color: blueColor, marginRight: 10, fontFamily: "Futura" }} href="#" onClick={() => {}}>
              Crie a sua conta
            </Link>
          </NavLink>
        )}
        {!authedUser ? (
          <NavLink
            to="/signin"
            exact
            style={{
              textDecoration: "none",
              color: blueColor,
              textDecoration: "none",
              marginLeft: 10,
              fontFamily: "Futura",
            }}
          >
            Entrar
          </NavLink>
        ) : (
          <NavLink
            to="/signout"
            exact
            style={{
              textDecoration: "none",
              color: blueColor,
              textDecoration: "none",
              marginLeft: 10,
              fontFamily: "Futura",
            }}
          >
            Sair
          </NavLink>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(Header);
