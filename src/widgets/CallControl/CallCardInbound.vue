<template>
  <div>
    <widget :title="callTypeText" v-if="!isCallDropped" :color="widgetColor">
      <template v-slot:body>
        <mdb-container>
          <mdb-row class="no-gutters">
            <mdb-col :col="cardWidth">
              <mdb-row>
                <mdb-col col="md-6" class="mb-3 d-flex">
                  <span strong class="fl_well_text big mx-auto">{{callingAddress}}</span>
                  <span
                    v-if="isCallConferenced"
                    strong
                    class="fl_well_text big mx-auto"
                  >{{conferencedCall.calledAddress}}</span>
                </mdb-col>
                <mdb-col col="md-6" class="mb-3 text-center">
                  <persist-timer :timerName="callTimerName" class="fl_well_text big"></persist-timer>
                </mdb-col>
              </mdb-row>

              <mdb-row>
                <mdb-col col="md-6" class="mb-3 d-flex">
                  <span strong class="fl_well_text big mx-auto">{{callStatusText}}</span>
                </mdb-col>
                <mdb-col col="md-6" class="mb-3 text-center">
                  <persist-timer :timerName="inStateTimerName" class="fl_well_text big"></persist-timer>
                </mdb-col>
              </mdb-row>
            </mdb-col>
            <!-- </mdb-row>
            <mdb-row>-->
            <!--START: Inbound Call Controls-->
            <!-- START: Answer/Drop Button -->
            <mdb-col :col="cardWidth">
              <mdb-row>
                <mdb-col col="md-4">
                  <transition name="fade">
                    <button
                      v-if="!isCallHeld"
                      type="button"
                      class="btn btn-circle"
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
                </mdb-col>
                <!-- END: Answer/Drop Button -->

                <!-- START: Hold Button -->
                <mdb-col col="md-4">
                  <transition name="fade">
                    <button
                      type="checkbox"
                      class="btn btn-circle"
                      :disabled="!isCallActive"
                      @click="holdUnholdCall"
                      :class="holdButtonColor"
                    >
                      <mdb-icon :icon="isCallHeld?'play':'pause'" style="font-size:1.5em" />
                    </button>
                  </transition>
                </mdb-col>
                <!--END: Hold Button-->

                <mdb-col col="md-4">
                  <transition name="fade">
                    <mdb-dropdown :class="{'fl_disabledWidget':!isCallActive}" v-if="!isCallConferenced">
                      <button
                        type="checkbox"
                        class="btn red lighten-1 btn-circle"
                        slot="toggle"
                        v-if="!isCallHeld"
                      >
                        <mdb-icon icon="users" style="font-size:1.5em" />
                      </button>
                      <mdb-modal size="sm">
                        <mdb-modal-header>
                          <mdb-modal-title>Consult Call</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>
                          <consult-dialer></consult-dialer>
                        </mdb-modal-body>
                      </mdb-modal>
                    </mdb-dropdown>
                  </transition>
                </mdb-col>
              </mdb-row>
            </mdb-col>
          </mdb-row>
        </mdb-container>
      </template>
    </widget>
  </div>
</template>

<script>
import ConsultDialer from '@/widgets/Dialer/ConsultDialer'
import CallDisposition from '@/widgets/CallDisposition/CallDisposition'
import PersistTimer from '@/components/agc/PersistTimer.vue'
import Widget from '@/components/agc/Widget'
import Utils from '@/services/Utils'
import {
  CALL_STATES,
  CALL_TYPES,
  SOCKET_EVENTS,
  TIMER_TYPES
} from '@/defines.js'

import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbPopover,
  mdbCard,
  mdbCardTitle,
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
  mdbModalFooter,
  mdbDropdown,
  mdbDropdownToggle,
  mdbDropdownItem,
  mdbDropdownMenu
} from 'mdbvue'

export default {
  name: 'CallCardInbound',
  components: {
    Widget,
    PersistTimer,
    ConsultDialer,
    CallDisposition,

    mdbPopover,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardTitle,
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
    mdbModalFooter,
    mdbDropdown,
    mdbDropdownToggle,
    mdbDropdownItem,
    mdbDropdownMenu
  },
  mounted() {},
  props: {
    ucid: String
  },

  data() {
    return {
      spinner: {
        show: false
      }
    }
  },
  methods: {
    showSpinner() {
      this.spinner.show = true
    },
    hideSpinner() {
      this.spinner.show = false
    },

    answerDropCall() {
      this.$store.dispatch('requestAnswerDropCall', [
        this.call.ucid,
        CALL_TYPES.INBOUND
      ])
    },
    holdUnholdCall() {
      this.$store.dispatch('requestHoldUnholdCall', this.call.ucid)
    },

    disposeCall() {
      this.$store.dispatch('removeCallFromActiveCalls')
    }
  },
  computed: {
    callTimerName() {
      return TIMER_TYPES.CALL_TIMER + '_' + this.ucid
    },
    inStateTimerName() {
      return TIMER_TYPES.IN_STATE_TIMER + '_' + this.ucid
    },
    cardWidth() {
      return this.$store.getters.getCalls.length > 2 ? 'md-12' : 'md-6'
    },

    call() {
      return this.$store.getters.getCallByUcid(this.ucid)
    },
    callStatus() {
      return this.call.status
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

    isCallHeld() {
      return this.callStatus === CALL_STATES.HELD
    },

    conferencedCall() {
      return this.call.consultedCall
    },
    isCallConferenced() {
      if (this.call.consultedCall && this.call.consultedCall) {
        return true
      } else {
        return false
      }
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
    widgetColor() {
      if (this.isCallHeld === false) {
        return 'success-color text-white'
      } else {
        return 'mdb-color text-white'
      }
    },
    answerButtonColor() {
      if (this.isCallRinging) {
        return { 'btn-green': true }
      } else if (this.isCallActive) {
        return { 'btn-red': true }
      } else {
        return { 'blue-grey': true }
      }
    },
    holdButtonColor() {
      if (this.isCallHeld) {
        return { 'blue-grey': true }
      } else {
        return { cyan: true }
      }
    },
    callingAddress() {
      switch (this.callType) {
        case CALL_TYPES.INBOUND:
          return this.call.callingAddress
        case CALL_TYPES.OUTBOUND:
          return this.call.calledAddress
        case CALL_TYPES.CONSULTED:
          return this.call.calledAddress
      }
    },

    callType() {
      return this.call.type
    },
    callTypeText() {
      switch (this.callType) {
        case CALL_TYPES.INBOUND:
          if (this.isCallConferenced) {
            return 'Conference Call'
          } else {
            return 'Inbound Call'
          }

        case CALL_TYPES.OUTBOUND:
          return 'Outbound Call'
        case CALL_TYPES.CONSULTED:
          return 'Consulted Call'
      }
    },

    callStatusText() {
      return CALL_STATES.Text[this.callStatus]
    },
    isCallDropped() {
      return this.callStatus === CALL_STATES.DROPPED
    }
  },
  watch: {
    callStatus: {
      immediate: true,
      deep: true,
      handler: function(newCallStatus, oldCallStatus) {
        console.log(
          'CallCardInbound/watch/callStatus(): newCallStatus=' +
            newCallStatus +
            ', oldCallStatus=' +
            oldCallStatus
        )
        switch (newCallStatus) {
          case CALL_STATES.IDLE:
          case CALL_STATES.UNKNOWN:
            break
          case CALL_STATES.RINGING:
            this.$store.dispatch('startTimer', this.callTimerName)
            break
          case CALL_STATES.TALKING:
          case CALL_STATES.HELD:
            console.log('calling stop and start timer for instateTimer')
            // this.$store.dispatch('stopTimer', this.inStateTimerName)

            this.$store.dispatch('startTimer', this.inStateTimerName)
            break
          default:
            this.$store.dispatch('stopTimer', this.callTimerName)
            this.$store.dispatch('stopTimer', this.inStateTimerName)
        }
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
  color: black;
  padding-right: 10px;
  padding-left: 10px;
  font-family: 'Unica One', sans-serif;
  font-size: 1.2em;
}

.fl_well_text.sm {
  font-size: 1em;
}

.fl_well_text.big {
  font-size: 1.3em;
  font-weight: 300;
  align-self: center;
}

.onHold {
  opacity: 0.7;
}

#callTimer {
  font-size: 1.1em;
}

.fl_dialerDrawer {
  position: fixed;

  /* border: rgba(0, 0, 0, 0.3) solid 2px; */
  border-top: none;
}

#consultDialer {
  top: 50px;
  left: 500px;
}

#outboundDialer {
  top: 50px;
  left: 800px;
}

.fldialerDrawer .default {
  top: 50px;
  padding-top: unset;
}

.fldialerDrawer .lowered {
  top: 60px;
  padding-top: 20px;
}

.hide-checkbox {
  opacity: 0;
  pointer-events: none;
}
.fl_container_callControl {
  width: 900px;
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
