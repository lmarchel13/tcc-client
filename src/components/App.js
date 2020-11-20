import React from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./Header";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";

const App = ({ dispatch, loading }) => {
  return (
    <Router>
      <Header />
      <Route path="/signup" exact component={Register} />
      <Route path="/signin" exact component={Login} />
      <Route path="/signout" exact component={Logout} />
    </Router>
  );
};

const mapStateToProps = ({ authedUser }) => ({ loading: !authedUser });

export default connect(mapStateToProps)(App);
