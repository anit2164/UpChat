import axios from "axios";

const API_URL = "http://3.218.6.134:9096";
// const API_URL = "http://3.218.6.134:9096";


const getHeader = () => {
  let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlVQMDAyMiIsIkxvZ2luVXNlcklkIjoiMiIsIkxvZ2luVXNlclR5cGVJZCI6IjIiLCJuYmYiOjE2ODg1MzgwNDUsImV4cCI6MTY4ODU3NDA0NSwiaWF0IjoxNjg4NTM4MDQ1fQ.KKXxpKrOfBDPVUg8a3GzEZRrFbvtl6DP-Jn8usdtMMg"
  let tokenData = localStorage.setItem("token", token)
  let user = localStorage.getItem("token");
  return user && { Authorization: user ,"X-API-KEY":"QXBpS2V5TWlkZGxld2FyZQ=="};
};
export default class Http {
  static get(url) {
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
  static post(url, body) {
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

  static patch(url, body) {
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

  static delete(url) {
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
