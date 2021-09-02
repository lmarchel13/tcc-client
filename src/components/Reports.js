import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

import { Paper, Tab } from "@material-ui/core";

import Title from "./Title";
import SnackBar from "./SnackBar";
import { blueBg, blueColor } from "../utils/colors";
import { API } from "../providers";

const REPORT_TABS = {
  LAST_YEAR: "LAST_YEAR",
  LAST_6M: "LAST_6M",
  LAST_1M: "LAST_1M",
  PER_COMPANY: "PER_COMPANY",
  PER_CATEGORY: "PER_CATEGORY",
};

const Reports = ({ authedUser, companies }) => {
  const [reportTab, setReportTab] = useState(REPORT_TABS.LAST_YEAR);
  const [reportData, setReportData] = useState([]);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchReport = async () => {
      const { data = [], err } = await API.getReport(reportTab, authedUser.jwt);

      if (err) {
        resetSnackBarState();
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      return data;
    };

    if (companies.length) {
      fetchReport().then((res) => {
        setReportData(res);
        setFirstLoaded(true);
      });
    }
  }, [companies, authedUser, reportTab]);

  const isActive = (activeTab) => {
    return activeTab === reportTab ? blueColor : blueBg;
  };

  return (
    <Fragment>
      <Title title="Relatórios de vendas" style={{ marginBottom: 16, marginTop: 0 }} />

      <div>
        <div style={{ display: "flex", marginTop: 32, marginBottom: 32, justifyContent: "center" }}>
          <Tab
            label="Último mês"
            onClick={() => setReportTab(REPORT_TABS.LAST_1M)}
            style={{ color: isActive(REPORT_TABS.LAST_1M) }}
          />
          <Tab
            label="Últimos 6 meses"
            onClick={() => setReportTab(REPORT_TABS.LAST_6M)}
            style={{ color: isActive(REPORT_TABS.LAST_6M) }}
          />
          <Tab
            label="Últimos 12 meses"
            onClick={() => setReportTab(REPORT_TABS.LAST_YEAR)}
            style={{ color: isActive(REPORT_TABS.LAST_YEAR) }}
          />
          <Tab
            label="Por empresa"
            onClick={() => setReportTab(REPORT_TABS.PER_COMPANY)}
            style={{ color: isActive(REPORT_TABS.PER_COMPANY) }}
          />
          <Tab
            label="Por categoria"
            onClick={() => setReportTab(REPORT_TABS.PER_CATEGORY)}
            style={{ color: isActive(REPORT_TABS.PER_CATEGORY) }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {firstLoaded ? (
            reportData.length === 0 ? (
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
                <span
                  style={{ width: "80%", margin: "0 auto", textAlign: "center", fontSize: "2vw", fontFamily: "Futura" }}
                >
                  Nenhum relatório encontrado nessa categoria
                </span>
              </Paper>
            ) : (
              <Fragment>
                <Paper elevation={3} style={{ padding: 64 }}>
                  <BarChart width={700} height={400} data={reportData} maxBarSize={10} barSize={10}>
                    <XAxis padding={{ left: 20, right: 100 }} type="category" dataKey="label" />
                    <YAxis type="number" dataKey="value" scale="quantile" />
                    <CartesianGrid horizontal={false} />
                    <Bar dataKey="value" fill={blueColor} />
                  </BarChart>
                </Paper>
              </Fragment>
            )
          ) : null}
        </div>
      </div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser, companies }) => {
  return { authedUser, companies };
};

export default connect(mapStateToProps)(Reports);
