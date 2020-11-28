import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import { Paper, Fab, Table, TableBody, TableCell, TableRow, Button } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import SnackBar from "./SnackBar";
import CreateCompanyModal from "./CreateCompanyModal";
import UpdateProfileModal from "./UpdateProfileModal";
import CompanyCard from "./CompanyCard";

import { API, Cache } from "../providers";
import { blueBg, blueColor } from "../utils/colors";
import { addCompanies } from "../actions/company";

const Profile = ({ authedUser, dispatch, companies = [] }) => {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

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
      {user && (
        <div style={{ marginTop: 32 }}>
          <h1 style={{ textAlign: "center", color: blueColor }}>Seus dados</h1>
          <Paper style={{ width: 600, height: 300, margin: "0 auto", marginTop: 64 }}>
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
      {!loading && companies.length > 0 ? (
        <div style={{ marginTop: 32 }}>
          <h1 style={{ textAlign: "center", color: blueColor }}>Suas empresas</h1>
          <div
            style={{
              width: "70%",
              margin: "0 auto",
              marginTop: 32,
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
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
      )}

      <div
        style={{
          position: "fixed",
          right: 50,
          bottom: 50,
        }}
      >
        <Fab aria-label="add" style={{ backgroundColor: blueColor, color: blueBg }} onClick={() => setOpenModal(true)}>
          <AddIcon />
        </Fab>
      </div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
      <CreateCompanyModal open={openModal} setOpen={setOpenModal} userId={authedUser} />
      {!!user && <UpdateProfileModal open={updateProfileModal} setOpen={setUpdateProfileModal} user={user} />}
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser, companies }) => {
  const loggedIn = !!authedUser && !!authedUser.jwt && !!authedUser.userId;
  return { authedUser, companies, loggedIn };
};

export default connect(mapStateToProps)(Profile);
