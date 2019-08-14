<template>
  <div class="fl_container_callControl d-flex align-items-center">
    <mdb-container fluid>
      <mdb-row class>
        <mdb-col col="md-8" class="fl_well_container w-100 px-0">
          <!--Primary Call Status-->
          <!-- <mdb-row class="p-1 mx-1 no-gutters" v-if="isCallIdle">
            <mdb-col col="12" class="fl_well_text mx-auto py-2">WAITING FOR CALL</mdb-col>
          </mdb-row>-->
          <mdb-row class="p-1 mx-1 no-gutters">
            <mdb-col col="2" class="fl_well_text">PRIMARY:</mdb-col>
            <mdb-col
              col="5"
              class="fl_well_text pl-4 text-center"
              :class="{'onHold':isCallHeld}"
            >{{callingAddress}}</mdb-col>
            <mdb-col col="3">
              <timer name="callStateTimer" class="fl_well_text" :class="{'onHold':isCallHeld}"></timer>
            </mdb-col>
            <mdb-col col="2" class="fl_well_text" :class="{'onHold':isCallHeld}">{{callStatusText}}</mdb-col>
          </mdb-row>

          <!--Conference Call Status-->
          <mdb-row class="p-1 mx-1 no-gutters" v-if="!isConfCallIdle">
            <mdb-col col="2" class="fl_well_text">CONSULT:</mdb-col>
            <mdb-col
              col="5"
              class="fl_well_text text-center"
              :class="{'onHold':isConfCallHeld}"
            >{{conferenceCalledAddress}}</mdb-col>
            <mdb-col col="3">
              <!-- <timer name="conferenceCallStateTimer" class="fl_well_text sm"></timer> -->
            </mdb-col>
            <mdb-col col="2" class="fl_well_text">{{conferenceCallStatusText}}</mdb-col>
          </mdb-row>
        </mdb-col>

        <mdb-col col="md-4">
          <div class="btn-group" role="group">
            <transition name="fade">
              <button
                type="button"
                class="btn"
                @click="answerDropCall"
                :disabled="isCallIdle"
                :class="[{iconGlow:isCallRinging}, answerButtonColor]"
              >
                <transition name="fade">
                  <mdb-icon icon="phone" style="font-size:1.5em" v-if="isCallRinging" />
                  <mdb-icon icon="phone-slash" style="font-size:1.5em" v-else />
                </transition>
              </button>
            </transition>
            <transition name="fade">
              <button
                type="checkbox"
                class="btn"
                v-if="isCallActive"
                @click="holdUnholdCall"
                :class="{'mdb-color': !isCallHeld}"
              >
                <mdb-icon icon="pause" style="font-size:1.5em" />
              </button>
            </transition>

            <transition name="fade">
              <button
                type="button"
                class="btn mdb-color"
                v-if="isCallActive"
                @click="toggleDialerDisplay"
              >
                <mdb-icon icon="users" style="font-size:1.5em" />
              </button>
            </transition>
          </div>
        </mdb-col>

        <div class="fl_dialerDrawer special-color" v-show-slide="showDialer && isCallActive">
          <dialer></dialer>
        </div>
      </mdb-row>
    </mdb-container>
  </div>

  <!-- </mdb-card-body>
  </mdb-card>-->
</template>

<script>
import Dialer from '@/components/widgets/Dialer/Dialer'
import Timer from '@/components/util/Timer'
import {
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
  mdbListGroup,
  mdbListGroupItem,
  mdbBadge,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter
} from 'mdbvue'
import { CALL_STATES, CALL_TYPES, SOCKET_EVENTS } from '@/defines.js'

import CallTimer from '@/components/util/CallTimer.vue'

export default {
  name: 'CallControl',
  components: {
    Timer,
    Dialer,
    CallTimer,
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
    mdbListGroup,
    mdbListGroupItem,
    mdbBadge,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter
  },
  mounted() {},
  props: {
    msg: String
  },

  data() {
    return { showDialer: false }
  },
  methods: {
    toggleDialerDisplay() {
      this.showDialer = !this.showDialer
    },
    answerDropCall() {
      this.$store.dispatch('requestAnswerDropCall', [
        this.$store.getters.getPrimaryCall.ucid,
        CALL_TYPES.PRIMARY
      ])
    },
    holdUnholdCall() {
      this.$store.dispatch('requestHoldUnholdCall', [
        this.$store.getters.getPrimaryCall.ucid,
        CALL_TYPES.PRIMARY
      ])
    }
  },
  computed: {
    callStatus() {
      return this.$store.getters.getCallStatus
    },
    conferenceCallStatus() {
      return this.$store.getters.getConsultedCallStatus
    },

    isCallIdle() {
      return (
        this.callStatus === CALL_STATES.IDLE ||
        this.callStatus === CALL_STATES.DROPPED
      )
    },
    isConfCallIdle() {
      return (
        this.conferenceCallStatus === CALL_STATES.IDLE ||
        this.conferenceCallStatus === CALL_STATES.DROPPED
      )
    },
    isCallRinging() {
      return this.callStatus === CALL_STATES.RINGING
    },
    isCallActive() {
      return (
        this.callStatus === CALL_STATES.TALKING ||
        this.callStatus === CALL_STATES.HELD
      )
    },

    isConfCallActive() {
      return (
        this.conferenceCallStatus === CALL_STATES.TALKING ||
        this.conferenceCallStatus === CALL_STATES.HELD
      )
    },
    isCallHeld() {
      return this.callStatus === CALL_STATES.HELD
    },

    isConfCallHeld() {
      return this.conferenceCallStatus === CALL_STATES.HELD
    },

    answerButtonText() {
      if (this.callStatus === CALL_STATES.RINGING) {
        return 'Answer'
      } else if (this.callStatus === CALL_STATES.TALKING) {
        return 'Drop'
      } else {
        return '-'
      }
    },
    answerButtonColor() {
      if (this.isCallRinging) {
        return { 'btn-success': true }
      } else if (this.isCallActive) {
        return { 'btn-deep-orange': true }
      } else {
        return { 'blue-grey': true }
      }
    },
    callingAddress() {
      if (this.isCallRinging || this.isCallActive) {
        return this.$store.getters.getPrimaryCall.callingAddress
      } else {
        return '-'
      }
    },

    callStatusText() {
      return CALL_STATES.Text[this.callStatus]
    },

    conferenceCalledAddress() {
      if (this.isCallRinging || this.isConfCallActive) {
        return this.$store.getters.getConsultedCall.calledAddress
      } else {
        return '-'
      }
    },

    conferenceCallStatusText() {
      return CALL_STATES.Text[this.conferenceCallStatus]
    }
  },
  watch: {
    callStatus(newCallStatus, oldCallStatus) {
      if (
        newCallStatus === CALL_STATES.IDLE ||
        newCallStatus === CALL_STATES.UNKNOWN
      ) {
        this.$store.dispatch('stopTimer', 'callStateTimer')
      } else if (
        newCallStatus !== CALL_STATES.IDLE ||
        newCallStatus !== CALL_STATES.UNKNOWN
      ) {
        //this.$store.commit('stopTimer', 'callStateTimer')
        this.$store.dispatch('startTimer', 'callStateTimer')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fl_well_container {
  background: rgba(0, 0, 0, 0.2);
}
.fl_well_text {
  color: rgba(255, 255, 255, 0.75);
  padding-right: 10px;
  padding-left: 10px;
  font-family: 'Unica One', cursive;
  font-size: 1.2em;
}

.fl_well_text.sm {
  font-size: 1em;
}

.onHold {
  opacity: 0.7;
}

#callTimer {
  font-size: 1.1em;
}

.fl_dialerDrawer {
  position: fixed;
  top: 45px;
  left: 390px;
  /* border: rgba(0, 0, 0, 0.3) solid 2px; */
  border-top: none;
}
.hide-checkbox {
  opacity: 0;
  pointer-events: none;
}
.fl_container_callControl {
  width: 500px;
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

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: linear;
  -webkit-transition-timing-function: linear;
  -o-transition-timing-function: linear;
  transition-timing-function: linear;
}

.slide-leave-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
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
</style>
