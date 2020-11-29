import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";

import { Divider, Paper } from "@material-ui/core";

import Title from "./Title";
import SnackBar from "./SnackBar";
import TransactionCard from "./TransactionCard";

import { API } from "../providers";

const Transactions = ({ authedUser }) => {
  const [loading, setLoading] = useState(true);
  const [buyerTransactions, setBuyerTransactions] = useState([]);
  const [sellerTransactions, setSellerTransactions] = useState([]);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!authedUser || !authedUser.jwt) return {};

      const { err, data = {} } = await API.getUserTransactions(authedUser.jwt);

      if (err) {
        resetSnackBarState();
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      return data;
    };

    fetchTransactions().then(({ buyer, seller }) => {
      setBuyerTransactions(buyer);
      setSellerTransactions(seller);

      setLoading(false);
    });
  }, [authedUser]);

  return (
    <Fragment>
      <div style={{ display: "flex", flex: 1, width: "70%", margin: "0 auto", marginTop: 64 }}>
        {!loading && (
          <div style={{ margin: "0 auto", width: "100%" }}>
            <div style={{ width: "100%", display: "flex", marginBottom: 64 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  margin: "0 auto",
                }}
              >
                <Title title="Histórico de Compras" style={{ marginBottom: 16, marginTop: 0 }} />
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: 16,
                  }}
                >
                  {buyerTransactions && buyerTransactions.length > 0 ? (
                    buyerTransactions.map((bt) => (
                      <TransactionCard key={bt.id} data={bt} token={authedUser.jwt} type="buyer" />
                    ))
                  ) : (
                    <Paper
                      elevation={3}
                      style={{
                        margin: "0 auto",
                        display: "flex",
                        width: "70%",
                        height: 50,
                        marginTop: 64,
                        padding: 64,
                        flexDirection: "column",
                      }}
                    >
                      <span style={{ width: "100%", margin: "0 auto", textAlign: "center", fontSize: 24 }}>
                        Sem histórico de compras
                      </span>
                    </Paper>
                  )}
                </div>
              </div>
            </div>
            <Divider style={{ width: "100%" }} />
            <div style={{ width: "100%", display: "flex", marginTop: 64 }}>
              <div style={{ display: "flex", flexDirection: "column", width: "100%", margin: "0 auto" }}>
                <Title title="Histórico de Vendas" style={{ marginBottom: 16, marginTop: 0 }} />
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: 16,
                  }}
                >
                  {sellerTransactions && sellerTransactions.length > 0 ? (
                    sellerTransactions.map((bt) => (
                      <TransactionCard key={bt.id} data={bt} token={authedUser.jwt} type="seller" />
                    ))
                  ) : (
                    <Paper
                      elevation={3}
                      style={{
                        margin: "0 auto",
                        display: "flex",
                        width: "70%",
                        height: 50,
                        marginTop: 64,
                        padding: 64,
                        flexDirection: "column",
                      }}
                    >
                      <span style={{ width: "80%", margin: "0 auto", textAlign: "center", fontSize: 24 }}>
                        Sem histórico de vendas
                      </span>
                    </Paper>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(Transactions);
