import axios from "axios";

import config from "./../../../public/settings.json";
import logger from "@/services/logger";
let instance = axios.create({
  baseURL: config.DGFT.MIDDLEWARE_URL,
  timeout: config.DGFT.MIDDLEWARE_TIMEOUT
});
export default {
  checkRMN(request) {
    logger.log("checkRMN(): request received Request=", request);
    return instance.get("/rmn/" + request.cli);
  },
  getServerIp() {
    return instance.get("/flairserverip");
  }
};
