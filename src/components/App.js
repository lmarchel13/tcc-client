import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoadingBar from "react-redux-loading-bar";

import "./styles/futura.css";

import Header from "./Header";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import Categories from "./Categories";
import Profile from "./Profile";
import CompanyServices from "./CompanyServices";
import Service from "./Service";
import ServicesByCategory from "./ServicesByCategory";
import Companies from "./Companies";
import DayOffers from "./DayOffers";
import Home from "./Home";
import Services from "./Services";
import Transactions from "./Transactions";
import { io } from "socket.io-client";

import { API, Cache } from "../providers";
import { setAuthedUser } from "../actions/authedUser";
import { addCategories } from "../actions/category";
import { defineWebSocket } from "../actions/webSocket";

import config from "../config";

const socket = io(config.API_BASE_URL);

const App = ({ dispatch }) => {
  useEffect(() => {
    const fetchCategories = async () => {
      const { data = [] } = await API.getCategories();
      dispatch(addCategories(data));
    };

    const payload = {
      jwt: Cache.getToken(),
      userId: Cache.getUserId(),
    };

    if (payload.userId && payload.jwt) {
      socket.emit("join", payload.userId);

      dispatch(setAuthedUser(payload));
    }

    dispatch(defineWebSocket(socket));
    fetchCategories();
  }, [dispatch]);

  return (
    <Router>
      <Header />

      <Fragment>
        <LoadingBar />
        <Route path="/signup" exact component={Register} />
        <Route path="/signin" exact component={Login} />
        <Route path="/signout" exact component={Logout} />
        <Route path="/profile" exact component={Profile} />

        <Route path="/categories" exact component={Categories} />
        <Route path="/categories/:categoryId" exact component={ServicesByCategory} />

        <Route path="/companies/:companyId/services" exact component={CompanyServices} />
        <Route path="/services/:serviceId" exact component={Service} />

        <Route path="/transactions" exact component={Transactions} />

        <Route path="/offers" exact component={DayOffers} />
        <Route path="/services" exact component={Services} />

        <Route path="/companies" exact component={Companies} />

        <Route path="/" exact component={Home} />
      </Fragment>
    </Router>
  );
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(App);
