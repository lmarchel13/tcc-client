import { combineReducers } from "redux";
import { loadingBarReducer as loadingBar } from "react-redux-loading";

import authedUser from "./authedUser";
import companies from "./company";

export default combineReducers({ authedUser, loadingBar, companies });
