import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Layout from "@Layout/layout";
import store from "./redux_toolkit/store/store";
import { Provider } from "react-redux";

const App = () => (
  <div className="container">
    <Layout />
  </div>
);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
