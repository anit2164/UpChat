import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Layout from "@Layout/layout";
import store from "./redux_toolkit/store/store";
import { Provider } from "react-redux";
import ChatListing from "./components/chat-list/chatListing";

const App = () => (
  <div className="container">
    <ChatListing />
    {/* <Layout /> */}
  </div>
);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
