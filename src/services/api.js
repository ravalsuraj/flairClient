import axios from "axios";

let instance = axios.create({
  baseURL: "http://localhost:9000/Flair",
  timeout: 15000
});

export default {
  getServerIp() {
    return axios.get("/flairserverip");
  },
  getConfig() {
    return axios.get("/config");
  },

  insertCallDetail(req) {
    let body = req;
    let head = {};
    return instance.post('/Call', body, { headers: head })
    // return axios.post("/config");
  },

  selectCallDetail(req) {
    let body = req;
    return instance.get('/Calls', body)
    // return axios.post("/config");
  }
};
