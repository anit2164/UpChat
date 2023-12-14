import {
  NetworkInfo,
  SubDomain,
  UserAPI,
  MemberAPI,
  UserExist,
} from "../constants/network";
import { HttpServices } from "./http/http_service";

export const signInRequest = async (userReqData: any) => {
  try {
    let httpService = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK + SubDomain.USEROPERTIONAPI + UserAPI.LOGIN;
    httpService.dataToSend = userReqData;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

export const Logout = async () => {
  const getToken: any = localStorage.getItem("apiKey");
  const lastCharRemoved = getToken.replace(/"/g, "");
  try {
    let httpService: any = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.USEROPERTIONAPI +
      UserAPI.LOGOUT +
      `?token=${lastCharRemoved}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = lastCharRemoved;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    return error;
  }
};

export const memberListing = async () => {
  const getToken: any = localStorage.getItem("apiKey");
  const lastCharRemoved = getToken.replace(/"/g, "");
  try {
    let httpService: any = new HttpServices();
    httpService.URL =
      NetworkInfo.UPCHATNETWORK +
      SubDomain.MEMBEROPERTIONAPI +
      MemberAPI.MEMBERLIST;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = lastCharRemoved;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

export const addMemberListing = async (addMember: any) => {
  const getToken: any = localStorage.getItem("apiKey");
  const lastCharRemoved = getToken.replace(/"/g, "");
  try {
    let httpService: any = new HttpServices();
    httpService.URL =
      NetworkInfo.UPCHATNETWORK +
      SubDomain.MEMBEROPERTIONAPI +
      MemberAPI.ADDMEMBER;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = lastCharRemoved;
    httpService.dataToSend = addMember;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

export const sendMessageRequest = async (userReqData: any) => {
  const getToken: any = localStorage.getItem("apiKey");
  const lastCharRemoved = getToken.replace(/"/g, "");
  try {
    let httpService: any = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK + SubDomain.VIEWALLHR + UserAPI.SENDMESSAGE;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = lastCharRemoved;
    httpService.dataToSend = userReqData;
    let response = await httpService.sendPostRequest();
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

export const IsUserExistRequest = async (loginUserId: any) => {
  const getToken: any = localStorage.getItem("apiKey");
  const lastCharRemoved = getToken.replace(/"/g, "");
  try {
    let httpService: any = new HttpServices();
    httpService.URL =
      NetworkInfo.NETWORK +
      SubDomain.VIEWALLHR +
      UserExist.ISCURRENTUSEREXIST +
      `?UserEmpID=${loginUserId}`;
    httpService.setAuthRequired = true;
    httpService.setAuthToken = lastCharRemoved;
    let response = await httpService.sendGetRequest();
    return response;
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};
