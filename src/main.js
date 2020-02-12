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
import "mdbvue/lib/css/mdb.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css'
// Vue.use(VueCookies);
// set default config
//VueCookies.config("1d");

// set global cookie
// VueCookies.set("theme", "default");
// VueCookies.set("hover-time", "1s");


//Used to detect long click. Used in the dialer to delete multiple digits upon long-click
const longClickInstance = longClickDirective({ delay: 400, interval: 50 });
Vue.directive("longclick", longClickInstance);
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: config.FLAIR_SERVER_URL,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);
Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
