import React, { Fragment, useState } from "react";
import { connect } from "react-redux";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import UpdateCompanyModal from "./UpdateCompanyModal";
import ConfirmModal from "./ConfirmModal";
import SnackBar from "./SnackBar";

import { API, Cache } from "../providers";
import { removeCompany } from "../actions/company";

const WEEK_DAYS = {
  0: "Segunda",
  1: "Terça",
  2: "Quarta",
  3: "Quinta",
  4: "Sexta",
  5: "Sábado",
  6: "Domingo",
};

const CompanyCard = ({ data, dispatch }) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  if (!data) return;
  const { id, name, description, email, phone, services } = data;

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

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const editCompany = () => {
    setOpenUpdateModal(true);
  };

  const deleteCompany = async () => {
    resetSnackBarState();
    const token = Cache.getToken();
    const { err } = await API.deleteCompany(id, token);

    if (err) {
      setSnackBarData({ text: err.description, severity: "error" });
      setOpenSnackBar(false);
    } else {
      await dispatch(removeCompany(id));
    }

    return setOpenUpdateModal(false);
  };

  return (
    <Fragment>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
      <UpdateCompanyModal setOpen={setOpenUpdateModal} open={openUpdateModal} data={data} />
      <ConfirmModal
        setOpen={setOpenConfirmModal}
        open={openConfirmModal}
        title="Remover empresa"
        text="Deseja realmente remover essa empresa?"
        onSubmit={() => {
          deleteCompany();
        }}
      />

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
          <Button onClick={editCompany} size="small">
            Editar
          </Button>
          <Button onClick={() => setOpenConfirmModal(true)} size="small">
            Remover
          </Button>
        </CardActions>
      </Card>
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser, companies }) => {
  return { authedUser, companies };
};

export default connect(mapStateToProps)(CompanyCard);
