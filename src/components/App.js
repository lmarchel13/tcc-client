import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./Header";

const App = ({ dispatch, loading }) => {
  return (
    <Router>
      <Header />
    </Router>
  );
};

const mapStateToProps = ({ authedUser }) => ({ loading: !authedUser });

export default connect(mapStateToProps)(App);
