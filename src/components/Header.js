import React, { useState, Fragment, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { Menu as MenuIcon } from "@material-ui/icons";

import { Button, Menu, MenuItem } from "@material-ui/core";

import SearchBar from "./SearchBar";
import SnackBar from "./SnackBar";

import { blueBg, blueColor } from "../utils/colors";
import logo from "../assets/logo.png";
import smallLogo from "../assets/small_logo.png";
import { API } from "../providers";

const links = [
  { to: "/categories", text: "Categorias" },
  { to: "/offers", text: "Ofertas do dia" },
  { to: "/companies", text: "Anunciantes" },
];

const MIN_WIDTH = 1000;

const Header = ({ loggedIn }) => {
  const history = useHistory();

  const [term, setTerm] = useState("");

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  window.addEventListener("resize", () => {
    if (ref && ref.current) setWidth(ref.current.clientWidth);
  });

  useEffect(() => {
    if (ref && ref.current) setWidth(ref.current.clientWidth);
  }, []);

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (to) => {
    setAnchorEl(null);
    if (to) history.push(to);
  };

  return (
    <Fragment>
      <div
        ref={ref}
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
        {width >= MIN_WIDTH ? (
          <div style={{ display: "flex", flex: 1, justifyContent: "center", width: "10%", height: "100%" }}>
            <img
              src={logo}
              alt="Logo"
              onClick={() => {
                history.push("/");
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flex: 1, justifyContent: "center", width: "10%", height: "100%" }}>
            <img
              src={smallLogo}
              alt="Logo"
              onClick={() => {
                history.push("/");
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        )}
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
          {width >= MIN_WIDTH && (
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
          )}
        </div>
        {/* Access control */}
        {width >= MIN_WIDTH && (
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
        )}
        {/* Menu icon for small width */}
        {width < MIN_WIDTH && (
          <div style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
            <Button aria-controls="menu" aria-haspopup="true" onClick={handleMenuClick}>
              <MenuIcon></MenuIcon>
            </Button>
            <Menu id="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {[
                ...links,
                ...(() => {
                  return loggedIn
                    ? [
                        { to: "/profile", text: "Perfil" },
                        { to: "/signout", text: "Sair" },
                      ]
                    : [
                        { to: "/signup", text: "Crie a sua conta" },
                        { to: "/signin", text: "Entrar" },
                      ];
                })(),
              ].map((link) => {
                return (
                  <MenuItem key={link.text} onClick={() => handleMenuClose(link.to)}>
                    {link.text}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        )}
      </div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser, loggedIn: authedUser && !!authedUser.jwt && !!authedUser.userId };
};

export default connect(mapStateToProps)(Header);
