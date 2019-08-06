<template>
  <div class="d-flex flex-column">
    <top-navbar v-if="isAgentLoggedIn"></top-navbar>
    <main class="d-flex flex-fill main-body">
      <router-view v-if="isAgentLoggedIn" class="fl_topSpacing"></router-view>
      <login-page v-else class="flex-fill fl_topSpacing"></login-page>
    </main>
    <!-- Footer -->
    <!-- <utility-bar v-if="isAgentLoggedIn"></utility-bar> -->
    <footer class="page-footer font-small special-color p-2"></footer>
    <!-- Footer -->

    <notifications group="error" />
  </div>
</template>

<script>
import {
  mdbContainer,
  mdbNavbar,
  mdbNavbarBrand,
  mdbNavItem,
  mdbNavbarNav,
  mdbNavbarToggler,
  mdbBtn,
  mdbIcon,
  mdbListGroup,
  mdbListGroupItem,
  mdbCardBody,
  mdbFooter,
  waves
} from 'mdbvue'
import Dashboard from '@/views/Dashboard'
import TopNavbar from '@/views/TopNavbar'
import LoginPage from '@/views/Login'
import UtilityBar from '@/views/UtilityBar.vue'

import { AGENT_STATES, SOCKET_EVENTS } from '@/defines'
import Utils from '@/services/Utils'
export default {
  name: 'AdminTemplate',
  components: {
    LoginPage,
    TopNavbar,
    Dashboard,
    UtilityBar,

    mdbContainer,
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbBtn,
    mdbIcon,
    mdbListGroup,
    mdbListGroupItem,
    mdbCardBody,
    ftr: mdbFooter,
    waves
  },
  data() {
    return {
      activeItem: 1,
      ipAddress: null
    }
  },
  sockets: {
    connect() {
      console.log(
        'App.vue/sockets/connect(): Connection to SocketIO Server Established'
      )

      this.$store.dispatch('processSocketConnected')
      //this.$store.dispatch('session/updateIpAddress')
    }
  },
  mounted() {
    this.$store.dispatch('session/addWindowRefreshReloadListener')
  },
  methods: {},
  computed: {
    isAgentLoggedIn() {
      if (
        this.$store.getters['getAgentState'] === AGENT_STATES.LOG_OUT ||
        this.$store.getters['getAgentState'] === AGENT_STATES.UNKNOWN
      ) {
        return false
      } else {
        return true
      }
    }
  },
  beforeMount() {
    this.activeItem = this.$route.matched[0].props.default.page
  },
  mixins: [waves]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url('https://fonts.googleapis.com/css?family=Unica+One&display=swap');

html {
  font-size: 70%;
  color: rgba(0, 0, 0, 0.45);
}
.main-body {
  height: calc(100vh - 25px);
  overflow-y: auto;
  background: linear-gradient(#fff, rgb(243, 243, 243));
}
footer {
  height: 25px;
}
.dispFont {
  font-family: 'Unica One', cursive;
}

@media (min-width: 992px) {
  .col-lg-2p5 {
    -ms-flex: 0 0 20.833333%;
    flex: 0 0 20.833333%;
    max-width: 20.833333%;
  }
}

.fl_widget {
  margin-bottom: 10px !important;
}

.fl_btn_btnIcon i {
  color: #9e9e9e;
}
.fl_btn_btnIcon:hover i {
  color: #00bcd4;
}
.fl_btn_btnIcon:active i {
  color: #0097a7;
}
.fl-color-agc {
  background: rgba(204, 0, 0, 1);
  background: -moz-linear-gradient(
    left,
    rgba(204, 0, 0, 1) 0%,
    rgba(255, 102, 0, 1) 100%
  );
  background: -webkit-gradient(
    left top,
    right top,
    color-stop(0%, rgba(204, 0, 0, 1)),
    color-stop(100%, rgba(255, 102, 0, 1))
  );
  background: -webkit-linear-gradient(
    left,
    rgba(204, 0, 0, 1) 0%,
    rgba(255, 102, 0, 1) 100%
  );
  background: -o-linear-gradient(
    left,
    rgba(204, 0, 0, 1) 0%,
    rgba(255, 102, 0, 1) 100%
  );
  background: -ms-linear-gradient(
    left,
    rgba(204, 0, 0, 1) 0%,
    rgba(255, 102, 0, 1) 100%
  );
  background: linear-gradient(
    to right,
    rgba(204, 0, 0, 1) 0%,
    rgba(255, 102, 0, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(
    startColorstr='#cc0000', endColorstr='#ff6600',
    GradientType=1 );
}
.fa-1p5x {
  font-size: 1.5em;
}
.btn-circle {
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 6px 0;
  font-size: 12px;
  line-height: 1.428571429;
  border-radius: 15px;
}
.btn-circle.btn-lg {
  width: 50px;
  height: 50px;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.33;
  border-radius: 25px;
}
.btn-circle.btn-xl {
  width: 70px;
  height: 70px;
  padding: 10px 16px;
  font-size: 24px;
  line-height: 1.33;
  border-radius: 35px;
}

/******************Slide Animation Styles********************/

.slide-enter-active {
  -moz-transition-duration: 0.4s;
  -webkit-transition-duration: 0.4s;
  -o-transition-duration: 0.4s;
  transition-duration: 0.4s;

  transition-timing-function: linear;
}

.slide-leave-active {
  -moz-transition-duration: 0.8s;
  -webkit-transition-duration: 0.8s;
  -o-transition-duration: 0.8s;
  transition-duration: 0.8s;
  -moz-transition-timing-function: linear;
  -webkit-transition-timing-function: linear;
  -o-transition-timing-function: linear;
  transition-timing-function: linear;
}

.slide-enter-to,
.slide-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}

.flip-list-move {
  transition: transform 0.2s;
}

/******************Fade Animation Styles********************/

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to
/* .-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.card {
  box-shadow: 3px 2px 15px 2px rgba(0, 0, 0, 0.16),
    0 2px 10px 0 rgba(0, 0, 0, 0.12) !important;
}
</style>
<style scoped>
main {
  /* background: url("https://cdn-images-1.medium.com/max/2000/1*AcYLHh0_ve4TNRi6HLFcPA.jpeg"); */
  background-size: cover;
}
.fl_topSpacing {
  padding-top: 64px;
}
</style>
