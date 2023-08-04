import Http from "./http";

export const SendMessageAPI = (data: any) => {
  return Http.post("ViewAllHR/SaveHRNotes", data);
};
