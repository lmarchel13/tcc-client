import React, { useState, useEffect, Fragment } from "react";
import moment from "moment";
import { connect } from "react-redux";

import "./styles/futura.css";

import { Typography, Paper, Button, Select, MenuItem, InputLabel, FormControl } from "@material-ui/core";

import SnackBar from "./SnackBar";

import { API, Cache } from "../providers";
import { blueColor, blueBg } from "../utils/colors";

const TYPES = {
  fixed: "Valor fixo",
  "by-hour": "Por hora",
};

const Service = ({
  match: {
    params: { serviceId },
  },
  authedUser,
}) => {
  const [service, setService] = useState(null);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [timeOptions, setTimeOptions] = useState([]);

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

  useEffect(() => {
    const fetchTransactionsByDay = async (service, day) => {
      if (!service || !day) return;

      resetSnackBarState();
      const { err, data } = await API.getTransactionsByDay(service.id, day);

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
        return;
      }

      buildTimeOptions(service, data);
    };

    fetchTransactionsByDay(service, day);
  }, [service, day]);

  const buildAddress = (data) => {
    const { address, city, state, postcode } = data;
    return `${address} - ${city}, ${state} - ${postcode}`;
  };

  const openMap = () => {
    const url = `https://www.google.com/maps/place/${buildAddress(service.company)}`;
    window.open(url, "_blank");
  };

  const buildDayOptions = (service) => {
    if (!service || !service.company || !service.company.openDays || !service.company.openDays) {
      return [];
    }

    const maxOptions = 20;
    const format = "DD/MM/YYYY";
    const days = [];
    const date = moment(new Date(), format);

    while (days.length !== maxOptions) {
      if (service.company.openDays.includes(`${date.day()}`)) {
        days.push(date.format(format));
      }
      date.add("1", "days");
    }

    return days;
  };

  const buildTimeOptions = (service, transactions = []) => {
    if (!service) return [];

    const existentTimes = transactions.map((transaction) => transaction.time);

    const { company } = service;
    const format = "HH:mm";
    const times = [];

    const [hours, minutes] = service.duration.split(":");

    const duration = +(hours * 60) + +minutes;
    const startTime = moment(company.startTime, format);
    const endTime = moment(company.endTime, format);

    while (startTime <= endTime) {
      const time = startTime.format(format);
      if (!existentTimes.includes(time)) {
        times.push(time);
      }
      startTime.add(duration, "minutes");
    }

    return setTimeOptions(times);
  };

  const bookService = async () => {
    resetSnackBarState();
    if (!day || !time) {
      setSnackBarData({ text: "Selecione dia e horário", severity: "error" });
      setOpenSnackBar(true);
      return;
    }

    const {
      id: serviceId,
      company: { id: companyId },
      value,
    } = service;

    const payload = { companyId, time, value, day };

    const { err } = await API.bookService(serviceId, payload, Cache.getToken());

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
    } else {
      setSnackBarData({ text: "Serviço agendado", severity: "success" });
    }

    resetSelects();
    setOpenSnackBar(true);
  };

  const resetSelects = (time) => {
    setDay("");
    setTime("");
    setTimeOptions(timeOptions.filter((t) => t !== time));
  };

  return (
    <Fragment>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {service && (
          <Fragment>
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
              <Typography
                variant="h4"
                component="h3"
                style={{ textAlign: "center", color: blueColor, marginBottom: 32, fontFamily: "Futura" }}
              >
                {service.name}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ marginBottom: 8, textAlign: "center", fontFamily: "Futura" }}
              >
                <i>{service.description}</i>
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ marginBottom: 8, textAlign: "center", fontFamily: "Futura" }}
              >
                <strong>Empresa:</strong> {service.company.name}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ marginBottom: 8, textAlign: "center", fontFamily: "Futura" }}
              >
                <strong>Endereço: </strong>
                <span onClick={openMap} style={{ cursor: "pointer" }}>
                  {buildAddress(service.company)}
                </span>
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ marginBottom: 8, textAlign: "center", fontFamily: "Futura" }}
              >
                <strong>Telefone:</strong> {service.company.phone}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ marginBottom: 8, textAlign: "center", fontFamily: "Futura" }}
              >
                <strong>Email:</strong> {service.company.email}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ marginBottom: 8, textAlign: "center", fontFamily: "Futura" }}
              >
                <strong>Duração:</strong> {service.duration}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                style={{ marginBottom: 8, textAlign: "center", fontFamily: "Futura" }}
              >
                <strong>Valor:</strong>{" "}
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(service.value)} (
                {TYPES[service.type]})
              </Typography>
              {authedUser && authedUser.jwt && authedUser.userId && (
                <div style={{ display: "flex", width: "60%", margin: "0 auto" }}>
                  <FormControl style={{ flex: 1, margin: 8 }}>
                    <InputLabel id="day-select" style={{ fontFamily: "Futura" }}>
                      Dia
                    </InputLabel>
                    <Select id="day-select" value={day} onChange={(e) => setDay(e.target.value)}>
                      {buildDayOptions(service).map((opt) => {
                        return (
                          <MenuItem key={opt} value={opt} style={{ fontFamily: "Futura" }}>
                            {opt}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl style={{ flex: 1, margin: 8 }}>
                    <InputLabel id="time-select" style={{ fontFamily: "Futura" }}>
                      Horario
                    </InputLabel>
                    <Select id="time-select" value={time} onChange={(e) => setTime(e.target.value)} disabled={!day}>
                      {timeOptions.map((opt) => {
                        return (
                          <MenuItem key={opt} value={opt} style={{ fontFamily: "Futura" }}>
                            {opt}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              )}
            </Paper>

            {authedUser && authedUser.jwt && authedUser.userId && (
              <Button
                disabled={!day && !time}
                style={{
                  backgroundColor: day && time ? blueBg : "lightgray",
                  color: day && time ? blueColor : "white",
                  width: "10%",
                  margin: "0 auto",
                  marginTop: 32,
                }}
                onClick={bookService}
              >
                Agendar
              </Button>
            )}
          </Fragment>
        )}
      </div>

      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(Service);
