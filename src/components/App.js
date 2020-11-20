import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./Header";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import Categories from "./Categories";
import MyCompanies from "./MyCompanies";

const App = () => {
  return (
    <Router>
      <Header />

      <Route path="/signup" exact component={Register} />
      <Route path="/signin" exact component={Login} />
      <Route path="/signout" exact component={Logout} />
      <Route path="/categories" exact component={Categories} />
      <Route path="/my-companies" exact component={MyCompanies} />
    </Router>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(App);
