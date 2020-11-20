import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import App from "./components/App";
import reducers from "./reducers";
import middlewares from "./middlewares";

import "./index.css";

const store = createStore(reducers, middlewares);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
