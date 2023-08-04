import { configureStore } from "@reduxjs/toolkit";
import allChannelListing from "../slices/allChannelListing";
import sendMessage from "../slices/sendMessage";
import addMemberListing from "../slices/addMemberListing";
const store = configureStore({
  reducer: {
    allChannelListing: allChannelListing,
    sendMessage: sendMessage,
    addMemberListing: addMemberListing,
  },
});

export default store;
