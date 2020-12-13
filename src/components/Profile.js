import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import { Paper, Fab, Table, TableBody, TableCell, TableRow, Button } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import SnackBar from "./SnackBar";
import CreateCompanyModal from "./CreateCompanyModal";
import UpdateProfileModal from "./UpdateProfileModal";
import CompanyCard from "./CompanyCard";
import Transactions from "./Transactions";
import Reports from "./Reports";
import ChatWindow from "./ChatWindow";
import ProfileMenuList from "./ProfileMenuList";

import { API, Cache } from "../providers";
import { blueBg, blueColor } from "../utils/colors";
import { addCompanies } from "../actions/company";

const TABS = {
  PROFILE: "PROFILE",
  COMPANIES: "COMPANIES",
  TRANSACTIONS: "TRANSACTIONS",
  REPORTS: "REPORTS",
  MESSAGES: "MESSAGES",
};

const Profile = ({ authedUser, dispatch, companies = [] }) => {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [tab, setTab] = useState(TABS.PROFILE);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [updateProfileModal, setUpdateProfileModal] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const ok = Cache.isUserLoggedIn();
    setIsAuthenticated(ok);
    if (!ok) history.push("/signin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!authedUser || !isAuthenticated) return;
      const { data, err } = await API.whoAmI(authedUser);

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      return data;
    };

    const fetchUserCompanies = async () => {
      if (!authedUser || !isAuthenticated) return [];
      resetSnackBarState();

      const { data = [], err } = await API.getUserCompanies({ userId: authedUser.userId, token: authedUser.jwt });

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      return data;
    };

    fetchUser().then((u) => {
      setUser(u);
      fetchUserCompanies().then((data) => {
        dispatch(addCompanies(data));
        setLoading(false);
      });
    });
  }, [authedUser, dispatch, isAuthenticated]);

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          flex: 1,
          margin: "0 auto",
          width: "70%",
          marginTop: 64,
        }}
      >
        {/* Menu */}
        <div style={{ flex: 2, justifyContent: "center", margin: "0 auto", alignItems: "center", marginRight: 32 }}>
          <ProfileMenuList tabs={TABS} setTab={setTab} style={{ marginTop: 128 }} />
        </div>
        {/* Main */}
        <div style={{ flex: 8, justifyContent: "center" }}>
          {/* PERFIL */}
          {user && tab === TABS.PROFILE && (
            <div style={{ marginTop: 32 }}>
              <h1 style={{ textAlign: "center", color: blueColor }}>Meus dados</h1>
              <Paper style={{ width: 600, height: 300, margin: "0 auto", marginTop: 64 }} elevation={3}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell style={{ textAlign: "center" }}>{user.firstName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sobrenome</TableCell>
                      <TableCell style={{ textAlign: "center" }}>{user.lastName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell style={{ textAlign: "center" }}>{user.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Senha</TableCell>
                      <TableCell style={{ textAlign: "center" }}>************</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
                  <Button
                    variant="contained"
                    size="small"
                    style={{
                      backgroundColor: blueBg,
                      width: "20%",
                      color: blueColor,
                      marginTop: 32,
                    }}
                    onClick={() => setUpdateProfileModal(true)}
                  >
                    Editar
                  </Button>
                </div>
              </Paper>
            </div>
          )}
          {/* EMPRESAS */}
          {tab === TABS.COMPANIES &&
            (!loading && companies.length > 0 ? (
              <div style={{ marginTop: 32 }}>
                <h1 style={{ textAlign: "center", color: blueColor }}>Minhas empresas</h1>
                <div
                  style={{
                    width: "70%",
                    margin: "0 auto",
                    marginTop: 32,
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  {companies.map((company, index) => {
                    return <CompanyCard data={company} key={index} />;
                  })}
                </div>
              </div>
            ) : (
              <Paper
                elevation={3}
                style={{
                  margin: "0 auto",
                  display: "flex",
                  width: "40%",
                  height: "300",
                  marginTop: 64,
                  padding: 32,
                  flexDirection: "column",
                }}
              >
                <span style={{ width: "80%", margin: "0 auto", textAlign: "center", fontSize: 24 }}>
                  Nenhuma empresa encontrada. Adicione sua primeira empresa clicando no botão adicionar logo abaixo.
                </span>
              </Paper>
            ))}
          {tab === TABS.COMPANIES && (
            <div
              style={{
                position: "fixed",
                right: 50,
                bottom: 50,
              }}
            >
              <Fab
                aria-label="add"
                style={{ backgroundColor: blueColor, color: blueBg }}
                onClick={() => setOpenModal(true)}
              >
                <AddIcon />
              </Fab>
            </div>
          )}
          {/* HISTORICO */}
          {tab === TABS.TRANSACTIONS && <Transactions />}
          {/* MENSAGENS */}
          {tab === TABS.MESSAGES && <ChatWindow user={user} />}
          {tab === TABS.REPORTS && <Reports />}
          <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
          <CreateCompanyModal open={openModal} setOpen={setOpenModal} userId={authedUser} />
          {!!user && <UpdateProfileModal open={updateProfileModal} setOpen={setUpdateProfileModal} user={user} />}
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser, companies }) => {
  const loggedIn = !!authedUser && !!authedUser.jwt && !!authedUser.userId;
  return { authedUser, companies, loggedIn };
};

export default connect(mapStateToProps)(Profile);
