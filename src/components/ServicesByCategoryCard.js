import React, { useState } from "react";
import { Paper, Typography } from "@material-ui/core";

import "./styles/futura.css";

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

const ServicesByCategoryCard = ({ service } = {}) => {
  const history = useHistory();
  const [isHover, setIsHover] = useState(false);

  const {
    id,
    name,
    description,
    duration,
    type,
    value,
    company: { id: companyId, name: companyName, openDays, startTime, endTime } = {},
  } = service;

  const buildOpenDays = ({ openDays, startTime, endTime }) => {
    const days = openDays.map((day) => WEEK_DAYS[+day]).join(", ");
    return `${days} das ${startTime}h às ${endTime}h`;
  };

  const openService = () => {
    history.push(`/services/${service.id}`);
  };

  return (
    <Paper
      elevation={3}
      style={{
        display: "flex",
        flex: 1,
        width: "30vw",
        heigth: "30vw",
        maxWidth: 350,
        maxHeight: 300,
        padding: 32,
        flexDirection: "column",
        margin: 16,
        border: isHover ? `0.6px solid ${blueColor}` : "0.6px solid transparent",
      }}
      onClick={() => openService()}
      key={id}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Typography
        variant="h5"
        component="h2"
        style={{ color: blueColor, marginBottom: 16, fontFamily: "Futura" }}
        noWrap={true}
      >
        {name}
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 16, fontFamily: "Futura" }} noWrap={true}>
        Oferecido por{" "}
        <Link to={`/companies/${companyId}`} style={{ textDecoration: "none", color: "black" }}>
          <i>{companyName}</i>
        </Link>
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 8, fontFamily: "Futura" }} noWrap={true}>
        <strong>Descrição:</strong> {description}
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 8, fontFamily: "Futura" }} noWrap={true}>
        <strong>Duração:</strong> {duration}h
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 8, fontFamily: "Futura" }} noWrap={true}>
        <strong>Valor:</strong> {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}{" "}
        {TYPES[type]}
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 8, fontFamily: "Futura" }} noWrap={true}>
        {buildOpenDays({ openDays, startTime, endTime })}
      </Typography>
    </Paper>
  );
};

export default ServicesByCategoryCard;
