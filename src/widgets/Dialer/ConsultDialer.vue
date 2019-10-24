<template>
  <!-- <mdb-card class="mb-0" color="special-color">
  <mdb-card-body class="p-2 mb-1">-->
  <div class="fl_container_dialer">
    <mdb-container fluid>
      <mdb-row class="px-3 py-4">
        <mdb-col class="d-flex align-items-baseline">
          <!--Input Textbox for digits-->
          <mdb-input
            class="fl_inp_dialedDigits light-blue-text px-3"
            type="number"
            v-model="dialedDigits"
            @click.stop
          ></mdb-input>
        </mdb-col>

        <!--Delete Single Digit-->
        <a
          class="black-text align-self-baseline mr-3 fl_btn_btnIcon"
          @click="deleteSingleDigit"
          @click.stop
        >
          <mdb-icon icon="backspace" size="1p5x" />
        </a>

        <!--Delete All Digits-->
        <a class="black-text align-self-baseline fl_btn_btnIcon" @click="clearDigits" @click.stop>
          <mdb-icon icon="trash" size="1p5x" />
        </a>
      </mdb-row>
      <mdb-row>
        <!--For Loop for cycling through array of digits to for a grid of dialpad digits-->
        <mdb-col col="md-4 px-0" v-for="digit in digits" :key="digit.id">
          <div
            class="fl_button_dialerDigit btn-block transparent-color text-center fl_btn_btnIcon"
            @click="appendDigit(digit)"
            @click.stop
          >{{digit}}</div>
        </mdb-col>
      </mdb-row>

      <mdb-row class="mx-0 pb-3">
        <transition name="fade">
          <mdb-btn
            class="mdb-color mx-2 w-100"
            v-if="isConsultCallIdle"
            @click="onConsultButtonClicked"
            @click.stop
          >
            <span class="spinner-border text-info float-left" v-if="spinner.show"></span>
            <span>Consult</span>
          </mdb-btn>
        </transition>
        <transition name="fade">
          <div class="btn-group w-100 pb-2" v-if="!isConsultCallIdle">
            <mdb-btn
              class="btn-deep-orange mx-2 px-2 w-100"
              @click="onConfDropButtonClicked"
              @click.stop
            >Drop</mdb-btn>
            <!-- <mdb-btn
              class="info-color mx-2 px-2 w-50"
              @click="onConfHoldBtnClicked"
            >{{confHoldText}}</mdb-btn>-->
          </div>
        </transition>
        <transition name="fade">
          <div class="btn-group w-100" v-if="!isConsultCallIdle">
            <mdb-btn class="mdb-color mx-2 px-2 w-50" @click="onTransferButtonClicked">Trans</mdb-btn>
            <mdb-btn class="mdb-color mx-2 px-2 w-50" @click="onConferenceButtonClicked">Conf</mdb-btn>
            <!-- <mdb-btn class="mdb-color mx-2 px-2" @click="onRejoinButtonClicked">Rejoin</mdb-btn> -->
            <!-- <mdb-btn class="mdb-color mx-2 px-2" @click="onSwitchButtonClicked">Switch</mdb-btn> -->
          </div>
        </transition>

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
import {
  CALL_STATES,
  CALL_TYPES,
  AGENT_STATES,
  SOCKET_EVENTS
} from '@/defines.js'

export default {
  name: 'ConsultDialer',
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
  props: {},

  data() {
    return {
      dialedDigits: '08879708222',
      digits: [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'],
      interval: false,
      digitDeleteSpeed: 200,
      initialDeleteSpeed: 500,
      spinner: {
        show: false
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
    showSpinner() {
      this.spinner.show = true
    },
    hideSpinner() {
      this.spinner.show = false
    },

    appendDigit(digit) {
      this.dialedDigits += digit
    },
    deleteSingleDigit() {
      console.log('deleteSingleDigits')
      this.dialedDigits = this.dialedDigits.slice(
        0,
        this.dialedDigits.length - 1
      )
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

    onConsultButtonClicked() {
      this.$store.dispatch('updateDialedDigits', this.dialedDigits)
      this.showSpinner()
      this.$store.dispatch('requestConsultCall').then(resp => {
        this.hideSpinner()
      })
    },

    onConferenceButtonClicked() {
      this.$store.dispatch('requestConferenceCall')
    },

    onTransferButtonClicked() {
      this.$store.dispatch('requestTransferCall')
    },

    onRejoinButtonClicked() {},
    onSwitchButtonClicked() {},

    onConfDropButtonClicked() {
      this.$store.dispatch('requestAnswerDropCall', [
        this.$store.getters.getConsultedCall.ucid,
        CALL_TYPES.CONSULTED
      ])
    },
    onConfHoldBtnClicked() {
      this.$store.dispatch('requestHoldUnholdCall', [
        this.$store.getters.getConsultedCall.ucid,
        CALL_TYPES.CONSULTED
      ])
    }
  },
  computed: {
    credentials() {
      return this.$store.getters.getAgentCredentials
    },
    callStatus() {
      return this.$store.getters.getPrimaryCall.status
    },
    isAgentStateHeld() {
      return this.$store.getters.getAgentState === AGENT_STATES.HELD
    },
    isConsultCallIdle() {
      return (
        this.$store.getters.getConsultedCallStatus === CALL_STATES.IDLE ||
        this.$store.getters.getConsultedCallStatus === CALL_STATES.DROPPED
      )
    },
    confHoldText() {
      return this.$store.getters.consultedCallStatus === CALL_STATES.HELD
        ? 'UNHOLD'
        : 'HOLD'
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
  font-family: 'Unica One', cursive;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 5px;
}

.fl_inp_dialedDigits input {
  font-size: 2em;
  color: rgba(255, 255, 255, 0.75);
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
