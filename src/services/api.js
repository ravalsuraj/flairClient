import axios from "axios";

let instance = axios.create({
  baseURL: "http://localhost:9000/Flair",
  timeout: 15000
});

export default {
  getConfig() {
    return axios.get("/config");
  },

  insertCallDetail(req) {
    let body = req;
    let head = {};
    return instance.post('/Call', body, { headers: head })
    // return axios.post("/config");
  }
};
