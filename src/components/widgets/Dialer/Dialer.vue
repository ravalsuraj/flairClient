<template>
  <!-- <mdb-card class="mb-0" color="special-color">
  <mdb-card-body class="p-2 mb-1">-->
  <div class="fl_container_dialer">
    <mdb-container fluid>
      <mdb-row class="px-3 py-4">
        <mdb-col class="d-flex align-items-baseline">
          <!-- <mdb-input
            type="tel"
            class="fl_inp_dialedDigits w-100"
            disabled
            :value="this.dialedDigits"
          ></mdb-input>-->
          <mdb-input
            class="fl_inp_dialedDigits light-blue-text px-3"
            type="number"
            v-model="dialedDigits"
          ></mdb-input>
        </mdb-col>
        <!--Delete Single Digit-->
        <a
          class="black-text align-self-baseline mr-3 fl_btn_btnIcon"
          @mouseclick="deleteSingleDigit"
        >
          <mdb-icon icon="backspace" size="1p5x"/>
        </a>

        <!--Delete All Digits-->
        <a class="black-text align-self-baseline fl_btn_btnIcon" @click="clearDigits">
          <mdb-icon icon="trash" size="1p5x"/>
        </a>
      </mdb-row>
      <mdb-row>
        <mdb-col col="md-4 px-0" v-for="digit in digits" :key="digit.id">
          <div
            class="fl_button_dialerDigit btn-block transparent-color text-center fl_btn_btnIcon"
            @click="appendDigit(digit)"
          >{{digit}}</div>
        </mdb-col>
      </mdb-row>
      <!-- <mdb-row>
        <mdb-col col="md-3 py-1 fl_well_container d-flex justify-content-between w-100">
          <div class="d-flex flex-column">
            <div class="fl_well_text" id="callingAddress" :class="{'onHold':isCallHeld}">
              <span>1234</span>
              <span
                icon="pause"
                style="font-size:0.75em"
                class="ml-1"
                :class="{'onHold':isCallHeld}"
              >on hold</span>
            </div>
            <div>
              <call-timer class="fl_well_text sm"></call-timer>
            </div>
          </div>
          <span class="fl_well_text sm">{{callStatusText}}</span>
        </mdb-col>
      </mdb-row>-->
      <mdb-row class="mx-0 pb-3">
        <mdb-btn class="mdb-color mx-2 w-100" @click="onConsultButtonClicked">Consult</mdb-btn>
        <div class="btn-group w-100">
          <mdb-btn class="mdb-color mx-2 px-2" @click="onTransferButtonClicked">Trans</mdb-btn>
          <!-- <mdb-btn class="mdb-color mx-2 px-2" @click="onSwitchButtonClicked">Switch</mdb-btn> -->
          <mdb-btn class="mdb-color mx-2 px-2" @click="onConferenceButtonClicked">Conf</mdb-btn>
          <!-- <mdb-btn class="mdb-color mx-2 px-2" @click="onRejoinButtonClicked">Rejoin</mdb-btn> -->
        </div>

        <!-- <mdb-btn class="unique-color">Conf</mdb-btn> -->
      </mdb-row>
    </mdb-container>
  </div>

  <!-- </mdb-card-body>
  </mdb-card>-->
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
import { CALL_STATES, SOCKET_EVENTS } from '@/defines.js'

import CallTimer from '@/components/util/CallTimer.vue'

export default {
  name: 'Dialer',
  components: {
    CallTimer,
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
  props: {},

  data() {
    return {
      dialedDigits: '08879708222',
      digits: [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'],
      interval: false,
      digitDeleteSpeed: 200,
      initialDeleteSpeed: 500
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
    appendDigit(digit) {
      this.dialedDigits += digit
    },
    deleteSingleDigit() {
      this.dialedDigits = this.dialedDigits.slice(0, -1)
    },
    startDeletingDigits() {
      this.interval = setInterval(
        () => this.deleteSingleDigit(),
        this.digitDeleteSpeed
      )
    },
    stopDeletingDigits() {
      clearInterval(this.interval)
    },
    clearDigits() {
      this.dialedDigits = ''
    },
    onRejoinButtonClicked() {},
    onSwitchButtonClicked() {},

    onConferenceButtonClicked() {
      let vm = this
      console.log('Conference Button Pressed')
      if (this.$store.state.devMode) {
        this.updateConferenceCall({
          responseCode: '0',
          responseMessage: 'success'
        })
      } else {
        console.log(
          'CONFCALL' +
            'Sending Socket Request: ' +
            JSON.stringify(this.$store.state.socketRequest)
        )
        this.$socket.emit(
          SOCKET_EVENTS.CONFERENCE_CALL,
          this.$store.state.socketRequest,
          function(resp) {
            vm.updateConferenceCall(resp)
          }
        )
      }
    },
    updateConferenceCall(resp) {
      if (resp.responseCode === '0') {
        console.log('Call Conference Successful' + JSON.stringify(resp))
        this.$store.dispatch('setConferenceCallStateInitiated', resp)
      } else {
        console.log('Call Conference Failed' + JSON.stringify(resp))
      }
    },

    onTransferButtonClicked() {
      let vm = this
      console.log('Transfer Button Pressed')
      if (this.$store.state.devMode) {
        this.updateTransferCall({
          responseCode: '0',
          responseMessage: 'success'
        })
      } else {
        console.log(
          'Sending Socket Request: ' +
            JSON.stringify(this.$store.state.socketRequest)
        )
        this.$socket.emit(
          SOCKET_EVENTS.TRANSFER_CALL,
          this.$store.state.socketRequest,
          function(resp) {
            vm.updateTransferCall(resp)
          }
        )
      }
    },
    updateTransferCall(resp) {
      if (resp.responseCode === '0') {
        console.log('Call Transfer Successful' + JSON.stringify(resp))
        this.$store.dispatch('setCallStateTransfered', resp)
      } else {
        console.log('Call Transfer Failed' + JSON.stringify(resp))
      }
    },

    onConsultButtonClicked() {
      this.$store.dispatch('updateDialedDigits', this.dialedDigits)
      let vm = this
      console.log('Consult Button Pressed')
      if (this.$store.state.devMode) {
        this.updateConsultCall({
          responseCode: '0',
          responseMessage: 'success'
        })
      } else {
        console.log(
          SOCKET_EVENTS.CONSULT_CALL +
            ' Sending Socket Request: ' +
            JSON.stringify(this.$store.state.socketRequest)
        )
        this.$socket.emit(
          SOCKET_EVENTS.CONSULT_CALL,
          this.$store.state.socketRequest,
          function(resp) {
            vm.updateConsultCall(resp)
          }
        )
      }
    },
    updateConsultCall(resp) {
      console.log(
        SOCKET_EVENTS.CONSULT_CALL + 'Received Response' + JSON.stringify(resp)
      )
      if (resp.responseCode === '0') {
        this.$store.dispatch('setCallStateConsulted', resp)
      }
    }
  },
  computed: {
    credentials() {
      return this.$store.getters.getAgentCredentials
    },
    callStatus() {
      return this.$store.getters.getPrimaryCall.status
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fl_container_dialer {
  /* box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); */
  border-radius: 0px 0px 8px 8px;
  max-width: 300px;
}
.fl_inp_dialedDigits {
  height: 25px;
  width: 100%;
  border-bottom: 1px solid grey;
  font-size: 1.5rem;
  overflow: hidden;
  background: white;
  border-radius: 5px;
}

.fl_button_dialerDigit {
  padding: 8px;
  cursor: pointer;
  font-size: 1.2rem;

  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}

.fl_button_dialerDigit:hover {
  color: #00bcd4;
  font-weight: bold;
  background-color: rgba(240, 240, 240, 0.05);
}
.fl_button_dialerDigit:active {
  color: #0097a7;
  background-color: rgba(200, 200, 200, 0.05);
}
.hide-checkbox {
  opacity: 0;
  pointer-events: none;
}
.fl_container_callControl {
  width: 1000px;
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

.fl_iconCallHangup {
  transform: rotate(135deg);
}
.fl_iconCallRinging {
  transform: rotate(-45deg);
}

.fl_iconGlow {
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
    -webkit-box-shadow: 0 0 6px #00c851;
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
    -moz-box-shadow: 0 0 6px #00c851;
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
    box-shadow: 0 0 6px #00c851;
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
    box-shadow: 0 0 6px #00c851;
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
</style>
