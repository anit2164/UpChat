import axios from "axios";

const API_URL = "http://3.218.6.134:9096";
// const API_URL = "http://3.218.6.134:9096";

const getHeader = () => {
  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlVQMDAyMiIsIkxvZ2luVXNlcklkIjoiMiIsIkxvZ2luVXNlclR5cGVJZCI6IjEiLCJuYmYiOjE2ODk1OTU5NjQsImV4cCI6MTY4OTYzMTk2NCwiaWF0IjoxNjg5NTk1OTY0fQ.6zHpu_-QiSRZFsNZ0nUsll-Oy6ImZ9F_jjqpy3LQYPU";
  let tokenData = localStorage.setItem("token", token);
  let user: any = localStorage.getItem("token");
  return (
    user && { Authorization: user, "X-API-KEY": "QXBpS2V5TWlkZGxld2FyZQ==" }
  );
};
export default class Http {
  static get(url: any) {
    return new Promise((resolve, reject) => {
      let token = getHeader();
      axios({
        method: "get",
        url: `${API_URL}/${url}`,
        headers: token,
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  static post(url: any, body: any) {
    return new Promise(async (resolve, reject) => {
      let token = getHeader();
      axios({
        method: "post",
        url: `${API_URL}/${url}`,
        data: body,
        headers: token,
      })
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  static patch(url: any, body: any) {
    return new Promise((resolve, reject) => {
      let token = getHeader();
      axios({
        method: "patch",
        url: `${API_URL}/${url}`,
        data: body,
        headers: token,
      })
        .then(function (response) {
          if (response.data && response.data.success) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    });
  }

  static delete(url: any) {
    return new Promise((resolve, reject) => {
      let token = getHeader();
      axios({
        method: "delete",
        url: `${API_URL}/${url}`,
        headers: token,
      })
        .then(function (response) {
          if (response.data && response.data.success) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    });
  }
}
