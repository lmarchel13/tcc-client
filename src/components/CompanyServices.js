import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import Title from "./Title";
import SnackBar from "./SnackBar";
import CreateServiceModal from "./CreateServiceModal";
import ServiceCard from "./ServiceCard";

import { API } from "../providers";
import { blueBg, blueColor } from "../utils/colors";

const CompanyServices = ({ authedUser }) => {
  const {
    state: { data: company },
  } = useLocation();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  useEffect(() => {
    const fetchServices = async (companyId) => {
      resetSnackBarState();
      const { data = [], err } = await API.getCompanyServices(companyId);

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(false);
      }

      setServices(data);
      setLoading(false);
    };

    fetchServices(company.id);
  }, [company.id, openModal]);

  return (
    <Fragment>
      <Fragment>
        <Title title={company.name} />
      </Fragment>
      {/* <h1 style={{ width: "100%", textAlign: "center", marginTop: 24 }}>{company.name}</h1> */}

      {!loading && services.length === 0 ? (
        <Paper
          elevation={3}
          style={{
            margin: "0 auto",
            display: "flex",
            width: "40%",
            height: "300",
            marginTop: 32,
            padding: 32,
            flexDirection: "column",
          }}
        >
          <span style={{ width: "100%", margin: "0 auto", textAlign: "center", fontSize: 24 }}>
            Está empresa não possui serviços cadastrados.
          </span>
        </Paper>
      ) : (
        <div
          style={{
            display: "flex",
            flex: 1,
            width: "70%",
            margin: "0 auto",
            marginTop: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {services.map((service) => {
            return <ServiceCard key={service.id} data={service} />;
          })}
        </div>
      )}
      {authedUser && authedUser.jwt && authedUser.userId && (
        <div
          style={{
            position: "fixed",
            right: 50,
            bottom: 50,
          }}
        >
          <Fab
            aria-label="add"
            style={{ backgroundColor: blueColor, color: blueBg }}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <AddIcon />
          </Fab>
        </div>
      )}
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
      <CreateServiceModal setOpen={setOpenModal} open={openModal} companyId={company.id} />
    </Fragment>
  );
};

const mapStateToProps = ({ authedUser }) => {
  return { authedUser };
};

export default connect(mapStateToProps)(CompanyServices);
