import { createSlice } from "@reduxjs/toolkit";
import { SendMessageAPI } from "../../shared/services/sendMessage";

const data = {
  isLoading: false,
  error: "",
  message: "",
  data: null,
};

const sendMessageSlice = createSlice({
  name: "sendMessage",
  initialState: data,
  reducers: {
    sendMessageInfo(state) {
      state.isLoading = false;
    },
    sendMessageSuccess(state, action) {
      state.isLoading = true;
      state.data = action.payload;
      state.message = "";
    },
    sendMessageFailed(state, action) {
      state.isLoading = false;
      state.message = action.payload;
      state.data = null;
    },
  },
});

export const sendMessageHandler = (data: any) => async (dispatch: any) => {
  try {
    dispatch(sendMessageAction.sendMessageInfo());
    const response = await SendMessageAPI(data);
    dispatch(sendMessageAction.sendMessageSuccess(response));
  } catch (e: any) {
    dispatch(sendMessageAction.sendMessageFailed(e?.response?.data?.message));
  }
};
export default sendMessageSlice.reducer;
export const sendMessageAction = sendMessageSlice.actions;
