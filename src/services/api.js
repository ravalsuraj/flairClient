import axios from "axios";

// let instance = axios.create({
//     baseURL: "https://cors-anywhere.herokuapp.com/http://in.crm.kefu.mi.com/api",
//     timeout: 15000
// });

let instance = axios.create({
  baseURL: "https://cors-anywhere.herokuapp.com/https://warm-oasis-63550.herokuapp.com/employee/",
  timeout: 15000
});

export default {
  getServerIp() {
    return axios.get("/NDRRestAPI");
  },
  getConfig() {
    return axios.get("/config");
  },
  insertCallDetail(req) {
    let body = req;
    let head = {};
    return instance.get('1234', body, { headers: head })
    // return axios.post("/config");
  },
};
