<template>
  <!-- <mdb-card class="mb-0" color="special-color">
  <mdb-card-body class="p-2 mb-1">-->
  <div class="fl_container_dialer">
    <mdb-container fluid>
      <form @click.stop>
        <mdb-row class="px-3 py-4" @click.stop>
          <mdb-col class="d-flex align-items-baseline">
            <!--Input Textbox for digits-->

            <input
              class="fl_inp_dialedDigits line light-blue-text px-3"
              type="text"
              v-model="dialedDigits"
              @click.stop
            />
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
      </form>
      <mdb-row>
        <!--For Loop for cycling through array of digits to for a grid of dialpad digits-->
        <mdb-col col="md-4 px-0" v-for="digit in digits" :key="digit.id">
          <div
            class="fl_button_dialerDigit btn-block transparent-color text-center fl_btn_btnIcon"
            @click="appendDigit(digit.text)"
            @click.stop
          >
            <div class="number">{{digit.text}}</div>
            <div class="subText">{{digit.subText}}</div>
          </div>
        </mdb-col>
      </mdb-row>

      <mdb-row class>
        <transition name="fade">
          <mdb-btn
            class="mdb-color mx-2 w-100"
            v-if="!isConsultedCallActive"
            @click="onConsultButtonClicked"
            @click.stop
          >
            <span class="spinner-border text-info float-left" v-if="spinner.show"></span>
            <span>Consult</span>
          </mdb-btn>
        </transition>
        <transition name="fade">
          <div class="btn-group w-100 pb-2" v-if="isConsultedCallActive">
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
          <div class="btn-group w-100" v-if="isConsultedCallActive">
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

      digits: [
        {
          text: 1,
          subText: ''
        },
        {
          text: 2,
          subText: 'ABC'
        },
        {
          text: 3,
          subText: 'DEF'
        },
        {
          text: 4,
          subText: 'GHI'
        },
        {
          text: 5,
          subText: 'JKL'
        },
        {
          text: 6,
          subText: 'MNO'
        },
        {
          text: 7,
          subText: 'PQRS'
        },
        {
          text: 8,
          subText: 'TUV'
        },
        {
          text: 9,
          subText: 'WXYZ'
        },
        {
          text: '*',
          subText: ''
        },
        {
          text: 0,
          subText: '+'
        },
        {
          text: '#',
          subText: ''
        }
      ],
      digitSubText: [
        '',
        'ABC',
        'DEF',
        'GHI',
        'JKL',
        'MNO',
        'PQRS',
        'TUV',
        'WXYZ',
        '',
        '+',
        ''
      ],
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
      this.$store.dispatch(
        'requestHoldUnholdCall',
        this.$store.getters.getConsultedCall.ucid
      )
    }
  },
  computed: {
    isConsultedCallActive() {
      return this.$store.getters.getConsultedCallList.length > 0
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
.line {
  display: block;
  border: none;
  color: #333;
  background: transparent;
  border-bottom: 1px dotted black;
  padding: 5px 2px 0 2px;
  font-size: 1.5em;
}

.line:focus {
  outline: none;
  border-color: #51cbee;
}

.line::-webkit-inner-spin-button,
.line::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.fl_container_dialer {
  /* box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); */
  border-radius: 0px 0px 8px 8px;
  max-width: 300px;
}
.fl_inp_dialedDigits {
  height: 25px;
  width: 100%;
  border-bottom: 1px solid grey;
  font-family: 'Unica One', san-serif;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.75);
}

.fl_inp_dialedDigits input {
  font-size: 2em;
  color: rgba(255, 255, 255, 0.75);
}

.fl_button_dialerDigit {
  padding: 8px;
  cursor: pointer;

  -webkit-user-select: none; /* Safari 3.1+ */
  -moz-user-select: none; /* Firefox 2+ */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}

.fl_button_dialerDigit .number {
  font-family: 'Unica One', san-serif;
  font-size: 1.3rem;
  font-weight: 400;
}

.fl_button_dialerDigit .subText {
  font-size: 0.9rem;
  font-weight: 300;
}

.fl_button_dialerDigit:hover {
  color: #00bcd4;

  background-color: rgba(240, 240, 240, 0.05);
}
.fl_button_dialerDigit:hover .number {
  font-size: 1.3rem;
  font-weight: 700;
}
.fl_button_dialerDigit:active {
  color: #0097a7;
  background-color: rgba(200, 200, 200, 0.05);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
