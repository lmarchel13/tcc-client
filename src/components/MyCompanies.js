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

const MyCompanies = ({ authedUser, dispatch, companies }) => {
  const history = useHistory();
  if (!authedUser) history.push("/signin");

  const [loading, setLoading] = useState(true);
  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchUserCompanies = async () => {
      if (!authedUser) return;
      console.log("fetchUserCompanies called");
      resetSnackBarState();

      const token = Cache.getToken();
      const { data, err } = await API.getUserCompanies({ userId: authedUser, token });

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
        return;
      }

      return data;
    };

    fetchUserCompanies().then(async (data) => {
      await dispatch(addCompanies(data));
      setLoading(false);
    });
  }, [authedUser, dispatch]);

  return (
    <div>
      {!loading && !companies.length && (
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
      {companies && !!companies.length && (
        <div>
          <div style={{ width: "70%", margin: "0 auto", marginTop: 32, display: "flex", flex: 1, flexWrap: "wrap" }}>
            {companies.map((company) => {
              return <CompanyCard data={company} key={company.id} />;
            })}
          </div>
        </div>
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
  return { authedUser, companies };
};

export default connect(mapStateToProps)(MyCompanies);
