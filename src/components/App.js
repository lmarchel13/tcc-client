import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoadingBar from "react-redux-loading-bar";

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

import { API, Cache } from "../providers";
import { setAuthedUser } from "../actions/authedUser";
import { addCategories } from "../actions/category";

const App = ({ dispatch }) => {
  useEffect(() => {
    const payload = {
      jwt: Cache.getToken(),
      userId: Cache.getUserId(),
    };

    const fetchCategories = async () => {
      const { data = [] } = await API.getCategories();

      dispatch(addCategories(data));
    };

    dispatch(setAuthedUser(payload));
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
