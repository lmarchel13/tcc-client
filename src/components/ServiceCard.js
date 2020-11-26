import React from "react";
import { useHistory } from "react-router-dom";

import { Paper, Typography } from "@material-ui/core";
import { blueColor } from "../utils/colors";

const TYPES = {
  fixed: "Valor fixo",
  "by-hour": "Por hora",
};

const ServiceCard = ({ data }) => {
  const history = useHistory();
  const {
    id,
    name,
    description,
    duration,
    type,
    value,
    category: { name: categoryName },
  } = data;

  const handleClick = () => {
    history.push(`/services/${id}`, data);
  };

  return (
    <Paper
      elevation={3}
      style={{
        margin: "0 auto",
        display: "flex",
        minWidth: 275,
        maxWidth: 275,
        height: "300",
        padding: 32,
        margin: 32,
        flexDirection: "column",
      }}
      onClick={handleClick}
    >
      <Typography variant="h5" component="h2" style={{ textAlign: "center", color: blueColor, marginBottom: 16 }}>
        {name}
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 16, textAlign: "center" }}>
        <i>{description}</i>
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 8 }}>
        <strong>Categoria:</strong> {categoryName}
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 8 }}>
        <strong>Duração:</strong> {duration}
      </Typography>
      <Typography variant="body2" component="p" style={{ marginBottom: 8 }}>
        <strong>Valor:</strong> {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)} (
        {TYPES[type]})
      </Typography>
    </Paper>
  );
};

export default ServiceCard;
