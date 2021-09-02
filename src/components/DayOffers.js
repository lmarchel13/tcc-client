import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { flatten } from "lodash";

import "./styles/futura.css";

import SnackBar from "./SnackBar";
import ServicesByCategoryCard from "./ServicesByCategoryCard";
import { API } from "../providers";
import Title from "./Title";

const DayOffers = ({ categories, homeScreen = false }) => {
  const [services, setServices] = useState([]);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const buildOffers = async (categories, offers) => {
    const categoriesObj = {};
    categories.forEach((category) => {
      categoriesObj[category.id] = category;
    });

    const data = offers.map((company) => {
      const { services = [] } = company;
      delete company.services;

      return services.map((service) => {
        const { category: categoryId } = service;
        service.company = company;
        service.category = categoriesObj[categoryId];

        return service;
      });
    });

    return flatten(data);
  };

  useEffect(() => {
    const fetchDayOffers = async () => {
      const limit = 24;
      const offset = 0;
      const { data = [], err } = await API.getDayOffers({ limit, offset });

      if (err) {
        resetSnackBarState();
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      console.log("offers data size:", data.length);

      return data;
    };

    if (!categories || !categories.length) return;

    fetchDayOffers().then((dayOffers) => {
      buildOffers(categories, dayOffers).then((data) => {
        setServices(data);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  return (
    <Fragment>
      {!homeScreen && <Title title="Ofertas do dia" />}
      <div
        style={{
          display: "flex",
          flex: 1,
          width: "70%",
          margin: "0 auto",
          marginTop: 64,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            margin: "0 auto",
            justifyContent: "center",
            flexWrap: !homeScreen ? "wrap" : "nowrap",
          }}
        >
          {services.map((service) => {
            return <ServicesByCategoryCard key={service.id} service={service} />;
          })}
        </div>
      </div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ categories }) => {
  return { categories };
};

export default connect(mapStateToProps)(DayOffers);
