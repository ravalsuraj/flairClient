<template>
  <widget title="Test Bench" color="mdb-color">
    <template v-slot:body>
      <!-- <mdb-card-text><strong>Test Bench</strong></mdb-card-text> -->
      <form @submit.prevent>
        <mdb-container fluid>
          <mdb-col col>
            <mdb-row class>
              <mdb-col>
                <mdb-input name="call-status" disabled :value="callStatusText" label="Call Status" />
              </mdb-col>
              <mdb-col>
                <mdb-input name="agent-status" disabled :value="agentStatus" label="Agent Status" />
              </mdb-col>
            </mdb-row>
            <mdb-row>
              <div class="btn-group w-100 mb-2">
                <mdb-btn class="btn mdb-color white-text mx-2" @click="sendDevEvent">Dev Event</mdb-btn>
                <mdb-btn class="btn mdb-color white-text mx-2">Answer</mdb-btn>
              </div>
              <div class="btn-group w-100 my-2">
                <mdb-btn
                  class="btn mdb-color white-text mx-2"
                  @click="toggleDevMode"
                >Turn Dev {{devMode? "OFF" : "ON"}}</mdb-btn>
                <mdb-btn class="btn mdb-color white-text mx-2">Hold</mdb-btn>
              </div>
              <div class="btn-group w-100 my-2">
                <mdb-btn class="btn mdb-color white-text mx-2">Unhold</mdb-btn>
                <mdb-btn class="btn mdb-color white-text mx-2">Call</mdb-btn>
              </div>
            </mdb-row>
            <mdb-row>
              <mdb-col>
                <mdb-input
                  required
                  name="callingAddress"
                  v-model="simCall.callingAddress"
                  type="number"
                  label="ANI"
                />
              </mdb-col>
              <mdb-col>
                <mdb-input
                  required
                  name="calledAddress"
                  v-model="simCall.calledAddress"
                  type="number"
                  label="DNIS"
                />
              </mdb-col>
            </mdb-row>
            <div
              class="alert alert-danger"
              role="alert"
              v-if="showAgentNotReadyError"
            >Agent Not Ready Yet!</div>
            <mdb-row>
              <div
                class="alert alert-danger"
                role="alert"
                v-if="showAniNotEnteredError"
              >ANI Not Entered</div>

              <div class="btn-group w-100">
                <div
                  class="btn mdb-color white-text mx-2"
                  size="md"
                  @click="simulateIncomingCall"
                >Ring</div>
                <div class="btn mdb-color white-text mx-2" size="md" @click="hangupCall">Disconnect</div>
              </div>

              <br />
            </mdb-row>
          </mdb-col>
        </mdb-container>
      </form>
    </template>
  </widget>
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbInput,
  mdbIcon
} from 'mdbvue'
import { AGENT_STATES, CALL_STATES } from '@/defines.js'

export default {
  name: 'TestBench',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbInput,
    mdbIcon
  },
  mounted() {},
  props: {
    msg: String
  },

  data() {
    return {
      showAgentNotReadyError: false,
      showAniNotEnteredError: false,
      showWidget: false,
      simCall: {
        Status: '',
        calledAddress: '',
        callingAddress: ''
      }
    }
  },
  // sockets: {
  //   connect: function () {
  //       console.log('socket connected')
  //   },
  //   customEmit: function (data) {
  //       console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
  //   }
  // },
  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    },

    toggleDevMode() {
      this.$store.commit('TOGGLE_DEV_MODE')
    },
    answerHangupCall(state) {
      // $socket is socket.io-client instance
      switch (this.callStatus) {
        case CALL_STATES.RINGING:
          this.answerCall()
          break
        case CALL_STATES.TALKING:
          this.hangupCall()
          break
        default:
      }
    },
    answerCall(state) {
      this.$store.dispatch('setCallStateTalking')
    },
    hangupCall(state) {
      this.$store.dispatch('setCallStateDropped')
    },

    holdCall(state) {
      this.$store.dispatch('setCallStateHeld')
    },
    unholdCall(state) {
      this.$store.dispatch('setCallStateTalking')
    },
    simulateIncomingCall(state) {
      if (this.agentStatus !== AGENT_STATES.Text[AGENT_STATES.READY]) {
        this.showAgentNotReadyError = true
        this.showAniNotEnteredError = false
      } else if (this.simCall.callingAddress.length < 4) {
        this.showAniNotEnteredError = true
        this.showAgentNotReadyError = false
      } else {
        this.showAgentNotReadyError = false
        this.showAniNotEnteredError = false
        this.$store.dispatch('setCallStateRinging', this.simCall)
      }
    },

    sendDevEvent() {
      this.$socket.emit('DEV_EVENT', this.$store.state.socketRequest, resp => {
        console.log(resp)
      })
    },
    simulateMakeCall(state) {
      this.$socket.emit(
        'MAKECALL',
        this.$store.getters.getAgentCredentials,
        function(resp) {
          console.log(resp)
          if (resp.responseCode === '0') {
            console.log('Call Successful Successful' + JSON.stringify(resp))
          } else {
            console.log('Call Failed' + JSON.stringify(resp))
          }
        }
      )
    },
    simulateDisconnectCall(state) {
      this.$store.state.dispatch('setCallStateDropped')
    }
  },
  computed: {
    devMode() {
      return this.$store.state.devMode
    },
    callStatusText() {
      return CALL_STATES.Text[this.callStatus]
    },
    callStatus() {
      return this.$store.getters.getPrimaryCall.status
    },
    agentStatus() {
      return AGENT_STATES.Text[this.$store.getters['getAgentState']]
    },
    isCallIdle() {
      return this.callStatus === CALL_STATES.IDLE
    },
    isCallRinging() {
      return this.callStatus === CALL_STATES.RINGING
    },
    isCallActive() {
      return this.callStatus === CALL_STATES.TALKING
    },
    answerButtonText() {
      if (this.callStatus === CALL_STATES.RINGING) {
        return 'Answer'
      } else if (this.callStatus === CALL_STATES.TALKING) {
        return 'Hang up'
      } else {
        return '-'
      }
    },
    answerButtonColor() {
      if (this.callStatus === CALL_STATES.RINGING) {
        return 'success'
      } else if (this.callStatus === CALL_STATES.TALKING) {
        return 'danger'
      } else {
        return 'blue-grey'
      }
    },
    phoneNumber() {
      if (
        this.callStatus === CALL_STATES.RINGING ||
        this.callStatus === CALL_STATES.TALKING
      ) {
        return this.$store.getters.getPrimaryCall.callingNumber
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.iconCallRinging {
  transform: rotate(-45deg);
}

.iconGlow {
  -webkit-animation: glowing 1500ms infinite;
  -moz-animation: glowing 1500ms infinite;
  -o-animation: glowing 1500ms infinite;
  animation: glowing 1500ms infinite;
}
@-webkit-keyframes glowing {
  0% {
    background-color: #85d8a6;
    -webkit-box-shadow: 0 0 3px #85d8a6;
  }
  50% {
    background-color: #00c851;
    -webkit-box-shadow: 0 0 10px #00c851;
  }
  100% {
    background-color: #85d8a6;
    -webkit-box-shadow: 0 0 3px #85d8a6;
  }
}

@-moz-keyframes glowing {
  0% {
    background-color: #85d8a6;
    -moz-box-shadow: 0 0 3px #85d8a6;
  }
  50% {
    background-color: #00c851;
    -moz-box-shadow: 0 0 10px #00c851;
  }
  100% {
    background-color: #85d8a6;
    -moz-box-shadow: 0 0 3px #85d8a6;
  }
}

@-o-keyframes glowing {
  0% {
    background-color: #85d8a6;
    box-shadow: 0 0 3px #85d8a6;
  }
  50% {
    background-color: #00c851;
    box-shadow: 0 0 10px #00c851;
  }
  100% {
    background-color: #85d8a6;
    box-shadow: 0 0 3px #85d8a6;
  }
}

@keyframes glowing {
  0% {
    background-color: #85d8a6;
    box-shadow: 0 0 3px #85d8a6;
  }
  50% {
    background-color: #00c851;
    box-shadow: 0 0 10px #00c851;
  }
  100% {
    background-color: #85d8a6;
    box-shadow: 0 0 3px #85d8a6;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.gradient-button {
  margin: 10px;
  /* //font-family: "Arial Black", Gadget, sans-serif;
  //font-size: 20px; */
  padding: 15px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: #fff;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  width: 200px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  display: inline-block;
  border-radius: 25px;
}
.gradient-button:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  margin: 8px 10px 12px;
}
.gradient-button-1 {
  background-image: linear-gradient(
    to right,
    #ff0000 0%,
    /* #f7bb97 51%, */ #ec8208 100%
  );
}
.gradient-button-1:hover {
  background-position: right center;
}
.gradient-button-2 {
  background-image: linear-gradient(
    to right,
    #2bc0e4 0%,
    #eaecc6 51%,
    #2bc0e4 100%
  );
}
.gradient-button-2:hover {
  background-position: right center;
}
.gradient-button-3 {
  background-image: linear-gradient(
    to right,
    #7474bf 0%,
    #348ac7 51%,
    #7474bf 100%
  );
}
.gradient-button-3:hover {
  background-position: right center;
}
.gradient-button-4 {
  background-image: linear-gradient(
    to right,
    #00d2ff 0%,
    #3a7bd5 51%,
    #00d2ff 100%
  );
}
.gradient-button-4:hover {
  background-position: right center;
}
</style>
