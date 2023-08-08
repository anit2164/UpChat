import { createSlice } from "@reduxjs/toolkit";
import { AddMemberListingAPI } from "../../shared/services/addMember-Listing";

const data = {
  isLoading: false,
  error: "",
  message: "",
  data: null,
};

const addMemberSlice = createSlice({
  name: "addMemberListing",
  initialState: data,
  reducers: {
    addMemberListingInfo(state) {
      state.isLoading = false;
    },
    addMemberListingInfoSuccess(state, action) {
      state.isLoading = true;
      state.data = action.payload;
      state.message = "";
    },
    addMemberListingInfoFailed(state, action) {
      state.isLoading = false;
      state.message = action.payload;
      state.data = null;
    },
  },
});

export const addMemberListingHandler = () => async (dispatch: any) => {
  try {
    dispatch(addMemberAction.addMemberListingInfo());
    const response: any = await AddMemberListingAPI();
    dispatch(addMemberAction.addMemberListingInfoSuccess(response));
  } catch (e: any) {
    dispatch(
      addMemberAction.addMemberListingInfoFailed(e?.response?.data?.message)
    );
  }
};
export default addMemberSlice.reducer;
export const addMemberAction = addMemberSlice.actions;
