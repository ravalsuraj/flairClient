import axios from "axios";

export default {
  getConfig() {
    return axios.get("/config");
  }
};
