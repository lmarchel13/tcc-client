import React, { useState, useEffect, Fragment } from "react";

import { Paper } from "@material-ui/core";

import SnackBar from "./SnackBar";
import SearchBar from "./SearchBar";
import CompanyCard from "./CompanyCard";

import { API } from "../providers";
import Title from "./Title";

const Companies = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  const [term, setTerm] = useState("");

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchCompanies = async (filters) => {
      resetSnackBarState();
      const { data = [], err } = await API.getCompanies(filters);

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      setCompanies(data);
      setLoading(false);
    };

    const limit = 20;
    const offset = 0;

    fetchCompanies({ limit, offset });
  }, []);

  const search = async (e) => {
    e.preventDefault();

    const { data = [], err } = await API.getCompanies({ term });

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(true);
    }

    setCompanies(data);
  };

  return (
    <Fragment>
      <Title title="Empresas" />
      <SearchBar
        placeholder="Buscar empresas..."
        style={{ margin: "0 auto", marginTop: 64 }}
        onClick={search}
        term={term}
        setTerm={setTerm}
      />
      {!loading && companies.length > 0 ? (
        <div
          style={{
            width: "70%",
            margin: "0 auto",
            marginTop: 64,
            display: "flex",
            flex: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {companies.map((company, index) => {
            return <CompanyCard data={company} key={index} editable={false} />;
          })}
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
            Nenhuma empresa encontrada.
          </span>
        </Paper>
      )}
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

export default Companies;
