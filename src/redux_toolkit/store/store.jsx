import { configureStore } from "@reduxjs/toolkit";
import allChannelListing from "../slices/allChannelListing";

const store = configureStore({
  reducer: {
    allChannelListing: allChannelListing,
  },
});

export default store;
