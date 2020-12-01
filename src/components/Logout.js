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
    Cache.clearUserCompanies();
    Cache.clearUserId();

    history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(Logout);
