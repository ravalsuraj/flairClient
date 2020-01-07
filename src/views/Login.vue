<template>
  <mdb-container fluid class="d-flex fl_corner_bg">
    <!-- Material form login -->
    <mdb-row class="d-flex flex-fill justify-content-center">
      <mdb-col col="lg-6" class style>
        <!--Logout button only for testing. Remove it for production-->
        <a class="text-white" @click="agentLogoutBtnClicked">Logout</a>
        <mdb-card>
          <div class="pt-3 mx-auto">
            <img
              src="@/assets/flair_logo.png"
              class="ml-2 mr-5"
              alt="Responsive image"
              style="width: 200px"
            />
            <img
              src="@/assets/agc-logo_v2.jpg"
              class="mr-2 ml-5 pb-5"
              alt="Responsive image"
              style="width: 150px"
            />
          </div>
          <p class="h4 text-center my-4 py-3 fl-color-agc white-text">
            <span class="float-left pl-4">Login</span>
          </p>
          <mdb-card-body class="p-4">
            <div class="grey-text" @click.stop>
              <mdb-input
                required
                label="Agent ID"
                icon="user"
                type="text"
                v-model="credentials.agentId"
              />
              <mdb-input
                required
                label="Station ID"
                icon="phone"
                type="text"
                v-model="credentials.deviceId"
              />
              <mdb-input
                required
                label="Password"
                icon="lock"
                type="password"
                v-model="credentials.password"
              />
              <!-- <div class="d-flex justify-content-center mb-1">
                <div class="custom-control custom-radio custom-control-inline mr-5">
                  <input
                    type="radio"
                    class="custom-control-input"
                    id="auto-in"
                    name="login-type"
                    value="auto"
                    v-model="credentials.workMode"
                    checked
                  />
                  <label class="custom-control-label" for="auto-in">Auto-in</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    class="custom-control-input"
                    id="manual-in"
                    name="login-type"
                    value="manual"
                    v-model="credentials.workMode"
                  />
                  <label class="custom-control-label" for="manual-in">Manual-in</label>
                </div>
              </div> -->
              <span class="spinner-border text-info float-left" v-if="spinner.show"></span>
              <div class="btn-group text-center my-3 w-100">
                <mdb-btn
                  class="btn white-text unique-color mr-3"
                  @click="agentLoginBtnClicked"
                  @keydown="agentLoginBtnClicked"
                 
                >Log in</mdb-btn>
              </div>
            </div>
          </mdb-card-body>
          <mdb-alert :color="loginAlert.color" v-if="loginAlert.show">{{loginAlert.message}}</mdb-alert>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </mdb-container>
</template>

<script>
import {
  mdbAlert,
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbIcon,
  mdbTbl,
  mdbInput
} from 'mdbvue'
import WebSocketIndicator from '@/components/agc/WebSocketIndicator.vue'
import { SOCKET_EVENTS } from '@/defines.js'

export default {
  name: 'LoginPage',
  components: {
    WebSocketIndicator,
    mdbAlert,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbIcon,
    mdbTbl,
    mdbInput
  },
  mounted() {
    this.credentials = this.$store.getters.getAgentCredentials
  },
  props: {},

  data() {
    return {
      loginResponse: '',
      loginAlert: {
        message: '',
        color: '',
        show: false
      },
      credentials: {
        agentId: '',
        deviceId: '',
        password: '',
        workMode: 'auto'
      },
      spinner: {
        show: false
      },
      ipAddress: ''
    }
  },
  sockets: {},
  methods: {
    handleEnterKeyForLogin(e) {
      if (e.keyCode === 13) {
        this.agentLoginBtnClicked()
      }
    },
    async agentLoginBtnClicked(state) {
      let sendAgentLoginRequest = () => {
        this.$store.dispatch('sendAgentLoginRequest').then(resp => {
          this.hideSpinner()
          if (resp && response.responseCode && resp.responseCode === '0') {
            this.$store.dispatch('showErrorBanner', [
              'Welcome',
              'You are successfully logged in'
            ])
          }
        })
      }
      this.showSpinner()
      this.$store.dispatch('setAgentLoginCredentials', this.credentials)
      console.log('agentLoginBtnClicked(): login button clicked')

      let currentSessionId = this.$store.getters['session/getSessionId']

      if (!currentSessionId) {
        this.$store.dispatch('session/requestSessionFromServer').then(resp => {
          if (resp.sessionId) {
            sendAgentLoginRequest()
          } else {
            if (resp.responseCode === '05') {
              this.$store.dispatch('showErrorBanner', [
                'Agent Login Failed',
                resp.responseMessage
              ])
            } else {
              this.$store.dispatch('showErrorBanner', [
                'Agent Login Failed',
                'COuld not retrieve session ID from the server'
              ])
            }
          }
        })
      } else {
        sendAgentLoginRequest()
      }
    },

    agentLogoutBtnClicked() {
      console.log('Test Logout button clicked')
      this.$store.dispatch('setAgentLoginCredentials', this.credentials)
      this.$store.dispatch('sendAgentLogoutRequest')
    },

    hideAlert() {
      this.loginAlert.message = ''
      this.loginAlert.color = ''
      this.loginAlert.show = false
    },
    showAlert(color, message) {
      this.loginAlert.message = message
      this.loginAlert.color = color
      this.loginAlert.show = true
    },
    showSpinner() {
      this.spinner.show = true
    },
    hideSpinner() {
      this.spinner.show = false
    },

    simulateAgentLogin(State) {
      this.$store.commit('SET_AGENT_STATE_LOGIN')
    }
  },
  computed: {
    socketRequest() {
      return this.$store.state.socketRequest
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .fl_corner_bg {
} */
.fl_login_banner {
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
.login-radio-container {
  align-content: center;
  justify-content: space-around;
  display: flex;
  width: 50%;
  margin: auto;
  padding-bottom: 10px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.iconCallHangup {
  transform: rotate(135deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
