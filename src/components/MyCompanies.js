import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import SnackBar from "./SnackBar";
import CreateCompanyModal from "./CreateCompanyModal";
import { API, Cache } from "../providers";
import { blueBg, blueColor } from "../utils/colors";
import { addCompanies } from "../actions/company";
import CompanyCard from "./CompanyCard";

const MyCompanies = ({ authedUser, dispatch, companies = [] }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openModal, setOpenModal] = useState(false);

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
    const fetchUserCompanies = async () => {
      resetSnackBarState();
      if (!authedUser || !isAuthenticated) return [];

      const { data = [], err } = await API.getUserCompanies({ userId: authedUser.userId, token: authedUser.jwt });

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      return data;
    };

    fetchUserCompanies().then(async (data) => {
      await dispatch(addCompanies(data));
      setLoading(false);
    });
  }, [authedUser, dispatch, isAuthenticated]);

  return (
    <div>
      {!loading && companies.length > 0 ? (
        <div>
          <div style={{ width: "70%", margin: "0 auto", marginTop: 32, display: "flex", flex: 1, flexWrap: "wrap" }}>
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

      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
      <CreateCompanyModal open={openModal} setOpen={setOpenModal} userId={authedUser} />
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
    </div>
  );
};

const mapStateToProps = ({ authedUser, companies }) => {
  const loggedIn = !!authedUser && !!authedUser.jwt && !!authedUser.userId;
  console.log("companies", companies);
  return { authedUser, companies, loggedIn };
};

export default connect(mapStateToProps)(MyCompanies);
