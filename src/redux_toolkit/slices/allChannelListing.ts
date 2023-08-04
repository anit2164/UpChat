import { createSlice } from "@reduxjs/toolkit";
import { AllChannelListingAPI } from "../../shared/services/allChannel-Listing";

const data = {
  isLoading: false,
  error: "",
  message: "",
  data: null,
};

const allChannelSlice = createSlice({
  name: "allChannelListing",
  initialState: data,
  reducers: {
    allChannelListingInfo(state) {
      state.isLoading = false;
    },
    allChannelListingInfoSuccess(state, action) {
      state.isLoading = true;
      state.data = action.payload;
      state.message = "";
    },
    allChannelListingInfoFailed(state, action) {
      state.isLoading = false;
      state.message = action.payload;
      state.data = null;
    },
  },
});

export const allChannelListingHandler = () => async (dispatch: any) => {
  try {
    dispatch(allChannelAction.allChannelListingInfo());
    const response: any = await AllChannelListingAPI();
    dispatch(allChannelAction.allChannelListingInfoSuccess(response));
  } catch (e: any) {
    dispatch(
      allChannelAction.allChannelListingInfoFailed(e?.response?.data?.message)
    );
  }
};
export default allChannelSlice.reducer;
export const allChannelAction = allChannelSlice.actions;
