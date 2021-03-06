// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "bootstrap-css-only/css/bootstrap.min.css";

import Vue from "vue";
import Vuex from "vuex";
import App from "./App";
import router from "./router";
import Vue2TouchEvents from "vue2-touch-events";

import VueSocketIO from "vue-socket.io";
import VShowSlide from "v-show-slide";
import Vuedraggable from "vuedraggable";

// import VueCookies from "vue-cookies";
import Notifications from "vue-notification";
import { longClickDirective } from "vue-long-click";

import config from "./../public/settings.json";
import store from "./store/index";
import "mdbvue/lib/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import api from "./services/api";
import logger from "./services/logger";

// import "x-frame-bypass";
Vue.use(Notifications);
Vue.use(Vuex);
Vue.use(VShowSlide);
Vue.use(Vuedraggable);

//Used to detect long click. Used in the dialer to delete multiple digits upon long-click
const longClickInstance = longClickDirective({ delay: 400, interval: 50 });
Vue.directive("longclick", longClickInstance);

//initialize the URL to the settings.json URL
let serverIp = config.FLAIR_SERVER_URL;

//get the IP address dynamically for the websocket server. This is saved in the config.js file for the FlairClientLauncher
api
  .getConfig()
  .then(resp => {
    logger.log("resp=" + JSON.stringify(resp.data.FLAIR_SERVER_URL));
    if (resp.data.responseCode === "0") {
      serverIp = resp.data.ip;
      logger.log("main.js execution complete. using server URL=" + serverIp);
    } else {
      logger.error("could not fetch server ip address");
    }
    initVue();
  })
  .catch(() => {
    logger.log("could not fetch server IP , so using the value from settings.json");
    initVue();
  });

let initVue = () => {
  Vue.use(
    new VueSocketIO({
      debug: true,
      connection: serverIp,
      vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_"
      }
    })
  );
  Vue.use(Vue2TouchEvents);

  Vue.config.productionTip = false;
  Vue.prototype.$serverip = serverIp;
  Vue.mixin({
    data() {
      return {
        loggableSessionId: String
      };
    },
    beforeMount() { },
    methods: {
      serverLog(message) {
        if (message) logger.log(message);
      }
    }
  });
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};
