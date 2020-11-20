import { combineReducers } from "redux";
import { loadingBarReducer as loadingBar } from "react-redux-loading";

import authedUser from "./authedUser";

export default combineReducers({ authedUser, loadingBar });
