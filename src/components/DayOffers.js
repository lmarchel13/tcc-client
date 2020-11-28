import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { flatten } from "lodash";

import SnackBar from "./SnackBar";
import ServicesByCategoryCard from "./ServicesByCategoryCard";
import { API } from "../providers";
import Title from "./Title";

const DayOffers = ({ categories }) => {
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
      const limit = 20;
      const offset = 0;
      const { data = [], err } = await API.getDayOffers({ limit, offset });

      if (err) {
        resetSnackBarState();
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

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
      <Title title="Ofertas do dia" />
      <div
        style={{
          width: "70%",
          display: "flex",
          flexWrap: "wrap",
          margin: "0 auto",
          marginTop: 64,
        }}
      >
        {services.map((service) => {
          return <ServicesByCategoryCard key={service.id} service={service} />;
        })}
      </div>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
    </Fragment>
  );
};

const mapStateToProps = ({ categories }) => {
  return { categories };
};

export default connect(mapStateToProps)(DayOffers);
