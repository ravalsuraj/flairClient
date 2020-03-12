import axios from "axios";

import config from "./../../../public/settings.json";

let instance = axios.create({
  baseURL: config.DGFT.MIDDLEWARE.URL,
  timeout: config.DGFT.MIDDLEWARE.TIMEOUT
});
export default {
  checkRMN(request) {
    console.log("checkRMN(): request received Request=", request);
    return instance.get("/rmn/" + request.cli);
  },
  getServerIp() {
    return instance.get("/flairserverip");
  }
};
