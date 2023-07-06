import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Layout from "@Layout/layout";
import store from "./redux_toolkit/store/store";
import { Provider } from "react-redux";
import ChatListing from "./components/chat-list/chatListing";
import { BrowserRouter } from "react-router-dom";

const App = () => (
  <div className="container">
    <ChatListing />
    {/* <Layout /> */}
  </div>
);
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("app")
);
