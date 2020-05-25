import axios from "axios";

// let instance = axios.create({
//     baseURL: "https://cors-anywhere.herokuapp.com/http://in.crm.kefu.mi.com/api",
//     timeout: 15000
// });
export default {
  getServerIp() {
    return axios.get("/flairserverip");
  },
  getConfig() {
    return axios.get("/config");
  },
};
