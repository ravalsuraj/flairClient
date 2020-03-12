// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "bootstrap-css-only/css/bootstrap.min.css";

import Vue from "vue";
import Vuex from "vuex";
import App from "./App";
import router from "./router";
import Vue2TouchEvents from "vue2-touch-events";
import store from "./store/index";

import VueSocketIO from "vue-socket.io";
import VShowSlide from "v-show-slide";
import Vuedraggable from "vuedraggable";

// import VueCookies from "vue-cookies";
import Notifications from "vue-notification";
import { longClickDirective } from "vue-long-click";
import config from "./../public/settings.json";
// import "x-frame-bypass";
Vue.use(Notifications);
Vue.use(Vuex);
Vue.use(VShowSlide);
Vue.use(Vuedraggable);

import log4javascript from "log4javascript";
var log = log4javascript.getLogger();

// var inPageAppender = new log4javascript.InPageAppender();
// var inPageLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n");
// inPageAppender.setLayout(inPageLayout);
// log.addAppender(inPageAppender);
//var ajaxAppender = new log4javascript.AjaxAppender("/log");
var ajaxAppender = new log4javascript.AjaxAppender("http://192.168.110.99:9093/log");
var jsonLayout = new log4javascript.JsonLayout();
ajaxAppender.setLayout(jsonLayout);

ajaxAppender.setThreshold(log4javascript.Level.INFO);
log.addAppender(ajaxAppender);
console.log("main.js initialized");

// var console = {};
// window.console = console;
// console.log = function() {};

import "mdbvue/lib/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import api from "./services/api";

//Used to detect long click. Used in the dialer to delete multiple digits upon long-click
const longClickInstance = longClickDirective({ delay: 400, interval: 50 });

//initialize the URL to the settings.json URL
let serverIp = config.FLAIR_SERVER_URL;
Vue.directive("longclick", longClickInstance);

//get the IP address dynamically for the websocket server. This is saved in the config.js file for the FlairClientLauncher
api
  .getServerIp()
  .then(resp => {
    console.log("resp=" + JSON.stringify(resp.data));
    if (resp.data.responseCode === "0") {
      serverIp = resp.data.ip;
      initVue();
      console.log("main.js execution complete. using server URL=" + serverIp);
    } else {
      console.error("could not fetch server ip");
      initVue();
    }
  })
  .catch(() => {
    console.log("could not fetch server IP , so using the value from settings.json");
    initVue();
  });

let initVue = () => {
  Vue.use(
    new VueSocketIO({
      debug: true,
      connection: serverIp,
      vuex: {
        store,
        log4javascript,
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
    beforeMount() {
      const agent = this.$store.getters.getAgentCredentials;
      this.loggableSessionId = agent.agentId + "/" + agent.deviceId + "-" + this.$store.getters["session/getSessionId"];
      log.getEffectiveAppenders()[0].setSessionId(this.loggableSessionId);
    },
    methods: {
      serverLog(message) {
        console.log(message);
        if (message) log.info(message);
      }
    }
  });
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};
