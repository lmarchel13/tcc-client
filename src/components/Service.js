import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Typography, Paper } from "@material-ui/core";

import SnackBar from "./SnackBar";

import { API } from "../providers";
import { blueColor } from "../utils/colors";

const TYPES = {
  fixed: "Valor fixo",
  "by-hour": "Por hora",
};

const WEEK_DAYS = {
  0: "Segunda",
  1: "Terça",
  2: "Quarta",
  3: "Quinta",
  4: "Sexta",
  5: "Sábado",
  6: "Domingo",
};

const Service = ({
  match: {
    params: { serviceId },
  },
}) => {
  const [service, setService] = useState({ company: {} });

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchService = async () => {
      const { err, data } = await API.getService(serviceId);

      if (err) {
        resetSnackBarState();
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);

        return;
      }

      setService(data);
    };

    fetchService();
  }, [serviceId]);

  const buildOpenDays = (openDays = []) => {
    return openDays.map((day) => WEEK_DAYS[day]).join(", ");
  };

  const buildAddress = (data) => {
    const { address, city, state, postcode } = data;
    return `${address} - ${city}, ${state} - ${postcode}`;
  };

  const openMap = () => {
    const url = `https://www.google.com/maps/place/${buildAddress(service.company)}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />

      <Paper
        elevation={3}
        style={{
          margin: "0 auto",
          display: "flex",
          width: "30%",
          height: "300",
          marginTop: 64,
          padding: 32,
          flexDirection: "column",
        }}
      >
        <Typography variant="h3" component="h2" style={{ textAlign: "center", color: blueColor, marginBottom: 16 }}>
          {service.name}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginBottom: 8, textAlign: "center" }}>
          <i>{service.description}</i>
        </Typography>
        <Typography variant="body2" component="p" style={{ marginBottom: 8, textAlign: "center" }}>
          <strong>Empresa:</strong> {service.company.name}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginBottom: 8, textAlign: "center" }}>
          <strong>Endereço: </strong>
          <Link onClick={openMap} style={{ textDecoration: "none", color: "black" }}>
            {buildAddress(service.company)}
          </Link>
        </Typography>
        <Typography variant="body2" component="p" style={{ marginBottom: 8, textAlign: "center" }}>
          <strong>Telefone:</strong> {service.company.phone}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginBottom: 8, textAlign: "center" }}>
          <strong>Duração:</strong> {service.duration}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginBottom: 8, textAlign: "center" }}>
          <strong>Valor:</strong>{" "}
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(service.value)} (
          {TYPES[service.type]})
        </Typography>
        <Typography variant="body2" component="p" style={{ marginBottom: 8, textAlign: "center" }}>
          {buildOpenDays(service.company.openDays)} das {service.company.startTime} até {service.company.endTime}
        </Typography>
      </Paper>
    </div>
  );
};

export default Service;
