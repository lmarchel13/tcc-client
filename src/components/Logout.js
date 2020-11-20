import { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { Cache } from "../providers";
import { removeAuthedUser } from "../actions/authedUser";

const Logout = ({ dispatch }) => {
  const history = useHistory();

  useEffect(() => {
    dispatch(removeAuthedUser());
    Cache.clearToken();
    history.push("/");
  }, [dispatch, history]);

  return null;
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(Logout);
