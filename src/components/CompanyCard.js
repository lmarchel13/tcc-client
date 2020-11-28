import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import UpdateCompanyModal from "./UpdateCompanyModal";
import DeleteIcon from "@material-ui/icons/Delete";

import ConfirmModal from "./ConfirmModal";
import SnackBar from "./SnackBar";

import { API, Cache } from "../providers";
import { removeCompany } from "../actions/company";
import { blueColor } from "../utils/colors";

const WEEK_DAYS = {
  0: "Segunda",
  1: "Terça",
  2: "Quarta",
  3: "Quinta",
  4: "Sexta",
  5: "Sábado",
  6: "Domingo",
};

const CompanyCard = ({ data, dispatch, editable = true }) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  if (!data) return;
  const { id, name, documentType, document, description } = data;

  const buildAddress = (data) => {
    const { address, city, state, postcode } = data;
    return `${address} - ${city}, ${state} - ${postcode}`;
  };

  const buildPlan = (data) => {
    const {
      plan: { name },
    } = data;

    return `${name}`;
  };

  const buildOpenDays = ({ openDays, startTime, endTime }) => {
    const days = openDays.map((day) => WEEK_DAYS[+day]).join(", ");

    return `${days} das ${startTime}h às ${endTime}h`;
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
      setOpenSnackBar(true);
    } else {
      await dispatch(removeCompany(id));
    }

    return setOpenUpdateModal(false);
  };

  return (
    <Fragment>
      {editable && (
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
        </Fragment>
      )}

      <Card
        style={{
          minWidth: 500,
          maxWidth: 500,
          margin: 16,
        }}
        variant="outlined"
      >
        <CardContent>
          {editable && (
            <DeleteIcon
              style={{ float: "right", fontSize: 18, color: blueColor }}
              onClick={() => setOpenConfirmModal(true)}
            />
          )}
          <Typography variant="h5" component="h2" style={{ textAlign: "center", color: blueColor, marginBottom: 16 }}>
            {name}
          </Typography>
          {editable ? (
            <Typography variant="body2" component="p" style={{ marginBottom: 8, marginLeft: 8 }}>
              <strong>{documentType}:</strong> {document}
            </Typography>
          ) : (
            <Typography variant="body2" component="p" style={{ marginBottom: 8, marginLeft: 8 }}>
              <i>{description}</i> {document}
            </Typography>
          )}
          <Typography variant="body2" component="p" style={{ marginBottom: 8, marginLeft: 8 }}>
            <strong>Endereço:</strong> {buildAddress(data)}
          </Typography>
          {editable ? (
            <Typography variant="body2" component="p" style={{ marginBottom: 8, marginLeft: 8 }}>
              <strong>Plano:</strong> {buildPlan(data)}
            </Typography>
          ) : (
            <Typography variant="body2" component="p" style={{ marginBottom: 8, marginLeft: 8 }}>
              <i>{buildOpenDays(data)}</i>
            </Typography>
          )}
        </CardContent>
        <CardActions style={{ float: "right" }}>
          <Button size="small">
            <Link
              style={{ textDecoration: "none", color: blueColor }}
              to={{ pathname: `/companies/${id}/services`, state: { data } }}
            >
              {editable ? "Serviços" : "Visualizar Serviços"}
            </Link>
          </Button>
          {editable && (
            <Button onClick={editCompany} size="small" style={{ color: blueColor }}>
              Editar
            </Button>
          )}
        </CardActions>
      </Card>
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser, companies }) => {
  return { authedUser, companies };
};

export default connect(mapStateToProps)(CompanyCard);
