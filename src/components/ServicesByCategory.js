import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@material-ui/core";

import SnackBar from "./SnackBar";

import { API } from "../providers";
import { blueColor } from "../utils/colors";
import { Link, useHistory } from "react-router-dom";

const TYPES = {
  fixed: "",
  "by-hour": "(Por hora)",
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

const ServicesByCategory = ({
  match: {
    params: { categoryId },
  },
}) => {
  const history = useHistory();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    const fetchServicesByCategory = async (categoryId) => {
      resetSnackBarState();
      const { data = [], err } = await API.getServicesByCategory(categoryId);

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      setServices(data);
      setLoading(false);
    };

    fetchServicesByCategory(categoryId);
  }, [categoryId]);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const buildOpenDays = ({ openDays, startTime, endTime }) => {
    const days = openDays.map((day) => WEEK_DAYS[+day]).join(", ");

    return `${days} das ${startTime}h às ${endTime}h`;
  };

  const openService = (serviceId) => {
    history.push(`/services/${serviceId}`);
  };

  return (
    !loading && (
      <div
        style={{
          width: "70%",
          display: "flex",
          flexWrap: "wrap",
          margin: "0 auto",
          marginTop: 64,
        }}
      >
        <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />

        {services.length ? (
          services.map((service) => {
            const {
              id,
              name,
              description,
              duration,
              type,
              value,
              company: { id: companyId, name: companyName, openDays, startTime, endTime },
            } = service;

            return (
              <Paper
                elevation={3}
                style={{
                  display: "flex",
                  flex: 1,
                  minWidth: 350,
                  maxWidth: 350,
                  maxHeight: 300,
                  padding: 32,
                  flexDirection: "column",
                  margin: 16,
                }}
                onClick={() => openService(id)}
              >
                <Typography variant="h5" component="h2" style={{ color: blueColor, marginBottom: 16 }}>
                  {name}
                </Typography>
                <Typography variant="body2" component="p" style={{ marginBottom: 16 }}>
                  Oferecido por{" "}
                  <Link to={`/companies/${companyId}`} style={{ textDecoration: "none", color: "black" }}>
                    <i>{companyName}</i>
                  </Link>
                </Typography>
                <Typography variant="body2" component="p" style={{ marginBottom: 8 }}>
                  <strong>Descrição:</strong> {description}
                </Typography>
                <Typography variant="body2" component="p" style={{ marginBottom: 8 }}>
                  <strong>Duração:</strong> {duration}h
                </Typography>
                <Typography variant="body2" component="p" style={{ marginBottom: 8 }}>
                  <strong>Valor:</strong>{" "}
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)} {TYPES[type]}
                </Typography>
                <Typography variant="body2" component="p" style={{ marginBottom: 8 }}>
                  {buildOpenDays({ openDays, startTime, endTime })}
                </Typography>
              </Paper>
            );
          })
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
              Nenhum serviço encontrado para essa categoria.
            </span>
          </Paper>
        )}
      </div>
    )
  );
};

export default ServicesByCategory;
