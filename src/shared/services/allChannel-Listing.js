import Http from "./http";

export const AllChannelListingAPI = () => {
  return Http.get("Channel/GetList");
};
