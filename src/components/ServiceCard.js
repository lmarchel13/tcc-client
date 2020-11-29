import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { Paper, Typography } from "@material-ui/core";
import { blueColor } from "../utils/colors";

const TYPES = {
  fixed: "Valor fixo",
  "by-hour": "Por hora",
};

const ServiceCard = ({ data }) => {
  const history = useHistory();
  const [isHover, setIsHover] = useState(false);

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
        minWidth: 375,
        maxWidth: 375,
        height: "300",
        padding: 32,
        // eslint-disable-next-line no-dupe-keys
        margin: 16,
        flexDirection: "column",
        border: isHover ? `0.6px solid ${blueColor}` : "0.6px solid transparent",
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
