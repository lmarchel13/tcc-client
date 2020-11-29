import React, { useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";

import { Button, Divider, Paper, Typography } from "@material-ui/core";

import ConfirmModal from "./ConfirmModal";
import SnackBar from "./SnackBar";

import { blueColor } from "../utils/colors";
import { API } from "../providers";

const TransactionCard = ({ data, token, type } = {}) => {
  const history = useHistory();

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const {
    id,
    value,
    time,
    day,
    seller: { id: sellerId, name: sellerName },
    buyer: { firstName, lastName },
    service: { name: serviceName },
  } = data;

  console.log("TYPE", type);

  const deleteTransaction = async () => {
    const format = "DD/MM/YYYY";
    const today = moment(new Date(), format);

    if (today.isAfter(moment(day, format))) {
      resetSnackBarState();
      setSnackBarData({
        text: "Não é possivel cancelar esse agendamento. Motivo: serviço já realizado",
        severity: "error",
      });
      setOpenSnackBar(true);

      return;
    }

    const { err } = await API.deleteTransaction(id, token);

    resetSnackBarState();
    if (err) {
      setSnackBarData({
        text: err.description,
        severity: "error",
      });
    } else {
      setSnackBarData({
        text: "Agendamento cancelado com sucesso",
        severity: "error",
      });
    }
    setOpenSnackBar(true);
  };

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          minWidth: 375,
          maxWidth: 375,
          height: 100,
          padding: 32,
          margin: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 3 }}>
            <Typography
              variant="body2"
              component="p"
              style={{
                marginBottom: 16,
                textAlign: "center",
                cursor: type !== "seller" ? "pointer" : "auto",
                color: blueColor,
                fontFamily: "Futura",
              }}
              onClick={() => {
                if (type !== "seller") return;
                history.push(`/companies/${sellerId}/services`, { data: data.seller });
              }}
            >
              <i>
                <strong>{type === "seller" ? `${firstName} ${lastName}` : sellerName}</strong>
              </i>
            </Typography>
            <Typography
              variant="body2"
              component="p"
              style={{ marginBottom: 16, textAlign: "center", color: blueColor, fontFamily: "Futura" }}
            >
              <i>Serviço: {serviceName}</i>
            </Typography>
            <Typography
              variant="body2"
              component="p"
              style={{ marginBottom: 16, textAlign: "center", color: blueColor, fontFamily: "Futura" }}
            >
              <i>
                Data: {day} às {time}
              </i>
            </Typography>
          </div>
          <Divider orientation="vertical" flexItem style={{ marginLeft: 18 }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 2,
              marginLeft: 16,
              position: "relative",
            }}
          >
            <Typography
              variant="body2"
              component="p"
              style={{
                marginBottom: 16,
                textAlign: "center",
                alignSelf: "center",
                fontSize: 24,
                color: blueColor,
                fontFamily: "Futura",
              }}
            >
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
            </Typography>
            {type !== "seller" && (
              <Button
                style={{
                  position: "absolute",
                  bottom: 5,
                  right: -25,
                  color: blueColor,
                  fontFamily: "Futura",
                  fontSize: 10,
                }}
                onClick={() => setOpenConfirmModal(true)}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </Paper>
      <Fragment>
        <ConfirmModal
          setOpen={setOpenConfirmModal}
          open={openConfirmModal}
          title="Cancelar agendamento"
          text="Deseja cancelar esse agendamento?"
          onSubmit={deleteTransaction}
        />
        <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
      </Fragment>
    </div>
  );
};

export default TransactionCard;
