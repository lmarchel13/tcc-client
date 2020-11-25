import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoadingBar from "react-redux-loading-bar";

import Header from "./Header";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import Categories from "./Categories";
import MyCompanies from "./MyCompanies";
import { Cache } from "../providers";
import { setAuthedUser } from "../actions/authedUser";

const App = ({ dispatch }) => {
  useEffect(() => {
    const payload = {
      jwt: Cache.getToken(),
      userId: Cache.getUserId(),
    };

    dispatch(setAuthedUser(payload));
  }, [dispatch]);

  return (
    <Router>
      <Header />

      <Fragment>
        <LoadingBar />
        <Route path="/signup" exact component={Register} />
        <Route path="/signin" exact component={Login} />
        <Route path="/signout" exact component={Logout} />
        <Route path="/categories" exact component={Categories} />
        <Route path="/my-companies" exact component={MyCompanies} />
      </Fragment>
    </Router>
  );
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(App);
