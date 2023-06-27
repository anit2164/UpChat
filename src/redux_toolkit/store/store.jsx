import { configureStore } from "@reduxjs/toolkit";
import allChannelListing from "../slices/allChannelListing";
import sendMessage from "../slices/sendMessage";
const store = configureStore({
  reducer: {
    allChannelListing: allChannelListing,
    sendMessage:sendMessage,
  },
});

export default store;
