import React, { Fragment } from "react";
import { Paper } from "@material-ui/core";

import "./styles/scrollbar.css";

import DayOffers from "./DayOffers";

import { blueColor } from "../utils/colors";
import Companies from "./Companies";
import Title from "./Title";

const Home = () => {
  return (
    <Fragment>
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
          marginBottom: 64,
        }}
      >
        <span
          style={{
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            fontSize: 24,
            color: blueColor,
          }}
        >
          Seja bem-vindo ao <strong>Servicefy</strong>!<br></br>
          <br></br>Sua plataforma de anúncio e busca de serviços.
        </span>
      </Paper>

      <Title title="Ofertas do dia" />
      <div
        className="scrollbar"
        style={{
          margin: "0 auto",
          width: "100%",
          overflowX: "auto",
          display: "grid",
        }}
      >
        <DayOffers homeScreen={true} />
      </div>

      <Title title="Empresas" />
      <div
        className="scrollbar"
        style={{
          margin: "0 auto",
          width: "100%",
          overflowX: "auto",
          display: "grid",
        }}
      >
        <Companies homeScreen={true} searchBarEnabled={false} />
      </div>
    </Fragment>
  );
};

export default Home;
