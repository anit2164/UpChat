import Http from "./http";

export const AddMemberListingAPI = () => {
    return Http.get("UpChat/User/List");
};
