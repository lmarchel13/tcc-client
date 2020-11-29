import React, { useState, useEffect, Fragment } from "react";
import { Paper } from "@material-ui/core";
import { useLocation } from "react-router-dom";

import ServicesByCategoryCard from "./ServicesByCategoryCard";
import Title from "./Title";

const Services = () => {
  const { state } = useLocation();

  const [services, setServices] = useState(state.services);

  useEffect(() => {
    setServices(state.services);
  }, [state.services]);

  return (
    <Fragment>
      <Title title="Serviços" />
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
            <span style={{ width: "80%", margin: "0 auto", textAlign: "center", fontSize: 24 }}>
              Nenhum serviço encontrado para essa categoria.
            </span>
          </Paper>
        )}
      </div>
    </Fragment>
  );
};

export default Services;
