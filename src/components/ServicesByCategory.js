import React, { useState, useEffect, Fragment } from "react";
import { Paper } from "@material-ui/core";

import SnackBar from "./SnackBar";
import ServicesByCategoryCard from "./ServicesByCategoryCard";

import { API } from "../providers";

const ServicesByCategory = ({
  match: {
    params: { categoryId },
  },
}) => {
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

  return (
    <Fragment>
      {!loading && (
        <div
          style={{
            width: "70%",
            display: "flex",
            flexWrap: "wrap",
            margin: "0 auto",
            marginTop: 64,
            justifyContent: "center",
          }}
        >
          {services.length ? (
            services.map((service) => {
              return <ServicesByCategoryCard key={service.id} service={service} />;
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
              <span style={{ width: "80%", margin: "0 auto", textAlign: "center", fontSize: "2vw" }}>
                Nenhum serviço encontrado para essa categoria.
              </span>
            </Paper>
          )}
        </div>
      )}
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

export default ServicesByCategory;
