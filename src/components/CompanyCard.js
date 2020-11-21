import React from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const WEEK_DAYS = {
  0: "Segunda",
  1: "Terça",
  2: "Quarta",
  3: "Quinta",
  4: "Sexta",
  5: "Sábado",
  6: "Domingo",
};

const CompanyCard = ({ data }) => {
  if (!data) return;
  const { name, description, email, phone, services } = data;

  const buildAddress = (data) => {
    const { address, city, state, postcode } = data;
    return `${address} - ${city}, ${state} - ${postcode}`;
  };

  const buildDocument = (data) => {
    const { documentType, document } = data;
    return `${documentType}: ${document}`;
  };

  const buildSchedule = (data) => {
    const { startTime, endTime } = data;
    return `${startTime} até ${endTime}`;
  };

  const buildOpenDays = (data) => {
    const { openDays } = data;

    return openDays.map((day) => WEEK_DAYS[+day]).join(", ");
  };

  const buildPlan = (data) => {
    const {
      plan: { name, value },
    } = data;

    return `${name} (${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)})`;
  };

  const editCompany = () => {
    //
  };

  const deleteCompany = () => {
    //
  };

  return (
    <Card
      style={{
        minWidth: 500,
        maxWidth: 500,
        margin: 16,
      }}
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h5" component="h2" style={{ textAlign: "center" }}>
          {name}
        </Typography>
        <Typography style={{ marginBottom: 12 }} color="textSecondary">
          {description}
        </Typography>
        <Typography variant="body2" component="p">
          {buildDocument(data)}
        </Typography>
        <Typography variant="body2" component="p" style={{ marginBottom: 12 }}>
          {buildAddress(data)}
        </Typography>
        <Typography variant="body2" component="p">
          <strong>Email:</strong> {email}
        </Typography>
        <Typography variant="body2" component="p">
          <strong>Telefone:</strong> {phone}
        </Typography>
        <Typography variant="body2" component="p">
          <strong>Horario:</strong> {buildSchedule(data)}
        </Typography>
        <Typography variant="body2" component="p">
          <strong>Dias:</strong> {buildOpenDays(data)}
        </Typography>
        <Typography variant="body2" component="p">
          <strong>Plano:</strong> {buildPlan(data)}
        </Typography>
      </CardContent>
      <CardActions style={{ float: "right" }}>
        <Button size="small">Visualizar</Button>
      </CardActions>
    </Card>
  );
};

const mapStateToProps = ({ authedUser, companies }) => {
  return { authedUser, companies };
};

export default connect(mapStateToProps)(CompanyCard);
