import Http from "./http";

export const SendMessageAPI = (data) => {
  return Http.post("ViewAllHR/SaveHRNotes",data);
};
