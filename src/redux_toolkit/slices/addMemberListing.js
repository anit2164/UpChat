import { createSlice } from "@reduxjs/toolkit";
import { AddMemberListingAPI } from "@/shared/services/addMember-Listing";

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
            console.log(action.payload, "action.payload");
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

export const addMemberListingHandler = () => async (dispatch) => {
    try {
        dispatch(addMemberAction.addMemberListingInfo());
        const response = await AddMemberListingAPI();
        dispatch(addMemberAction.addMemberListingInfoSuccess(response));
    } catch (e) {
        dispatch(
            addMemberAction.addMemberListingInfoFailed(e?.response?.data?.message)
        );
    }
};
export default addMemberSlice.reducer;
export const addMemberAction = addMemberSlice.actions;
