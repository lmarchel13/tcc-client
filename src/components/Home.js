import React, { useState, useEffect, Fragment } from "react";
import { Divider, Paper } from "@material-ui/core";

import DayOffers from "./DayOffers";
import SnackBar from "./SnackBar";

import { API } from "../providers";
import { blueColor } from "../utils/colors";
import Companies from "./Companies";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [dayOffers, setDayOffers] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      const limit = 20;
      const offset = 0;
      const { data = [], err } = await API.getCompanies({ limit, offset });

      if (err) {
        resetSnackBarState();
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      return data;
    };

    fetchCompanies().then((data) => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  return (
    <Fragment>
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
          marginBottom: 64,
        }}
      >
        <span
          style={{
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            fontSize: 24,
            color: blueColor,
          }}
        >
          Seja bem-vindo ao <strong>Servicify</strong>!<br></br>
          <br></br> Cria sua conta, anuncie ou busque serviços de uma forma simplificada
        </span>
      </Paper>
      <DayOffers />
      <Companies searchBarEnabled={false} />

      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

export default Home;
