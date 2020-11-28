import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { flatten } from "lodash";

import SnackBar from "./SnackBar";
import ServicesByCategoryCard from "./ServicesByCategoryCard";
import { API } from "../providers";

const DayOffers = ({ categories = [] }) => {
  const [offers, setOffers] = useState([]);
  const [services, setServices] = useState([]);

  const [snackBarData, setSnackBarData] = useState({});
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const resetSnackBarState = () => {
    setOpenSnackBar(false);
    setSnackBarData({});
  };

  const buildOffers = () => {
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
      resetSnackBarState();
      const limit = 20;
      const offset = 0;
      const { data = [], err } = await API.getDayOffers({ limit, offset });

      if (err) {
        setSnackBarData({ text: err.description, severity: "error" });
        setOpenSnackBar(true);
      }

      setOffers(data);
    };

    fetchDayOffers().then(() => {
      const data = buildOffers();
      setServices(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <SnackBar data={snackBarData} open={openSnackBar} setOpen={setOpenSnackBar} />
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
    </Fragment>
  );
};

const mapStateToProps = ({ categories }) => {
  return { categories };
};

export default connect(mapStateToProps)(DayOffers);
