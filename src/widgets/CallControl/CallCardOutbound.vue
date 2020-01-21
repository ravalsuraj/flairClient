<template>
  <div>
    <widget :title="callTypeText" v-if="!isCallDropped" :color="widgetColor">
      <template v-slot:body>
        <mdb-container>
          <mdb-row class="no-gutters">
            <mdb-col :col="cardWidth">
              <mdb-row>
                <mdb-col col="6" class="mb-3 d-flex">
                  <span strong class="fl_well_text big mx-auto">{{callingAddress}}</span>
                  <span
                    v-if="isCallConferenced"
                    strong
                    class="fl_well_text big mx-auto"
                  >{{thirdAddress}}</span>
                </mdb-col>
                <mdb-col col="6" class="mb-3 text-center">
                  <persist-timer :timerName="callTimerName" class="fl_well_text big"></persist-timer>
                </mdb-col>
              </mdb-row>

              <mdb-row>
                <mdb-col col="6" class="mb-3 d-flex">
                  <span strong class="fl_well_text big mx-auto">{{callStatusText}}</span>
                </mdb-col>
                <mdb-col col="6" class="mb-3 text-center">
                  <persist-timer :timerName="inStateTimerName" class="fl_well_text big"></persist-timer>
                </mdb-col>
              </mdb-row>
            </mdb-col>

            <!--START: Inbound Call Controls-->
            <!-- START: Answer/Drop Button -->
            <mdb-col :col="cardWidth">
              <mdb-row>
                <mdb-col col="3">
                  <transition name="fade">
                    <button
                      v-if="!isCallHeld"
                      type="button"
                      class="btn btn-circle btn-red"
                      @click="answerDropCall"
                      :disabled="isCallIdle"
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
                <mdb-col col="3">
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

                <!-- START: Conference Button -->
                <mdb-col col="3">
                  <button
                    type="checkbox"
                    class="btn red lighten-1 btn-circle"
                    @click="showConferenceModal=true"
                    v-if="!isCallHeld && !isCallRinging"
                  >
                    <mdb-icon icon="users" style="font-size:1.5em" />
                  </button>

                  <mdb-modal
                    size="sm"
                    v-if="showConferenceModal"
                    @close="showConferenceModal=false"
                  >
                    <mdb-modal-header>
                      <mdb-modal-title>Consult Call</mdb-modal-title>
                    </mdb-modal-header>
                    <mdb-modal-body>
                      <div v-if="!isCallConsulted">
                        <consult-dialer :ucid="ucid" :callId="callId"></consult-dialer>
                      </div>

                      <div v-else>
                        <select
                          class="browser-default custom-select mb-5"
                          v-model="callIdToBeConferenced"
                          v-if="otherCalls"
                        >
                          <option selected disabled>Open this select menu</option>
                          <option
                            :value="call.callId"
                            v-for="call in otherCalls"
                            :key="call.id"
                          >{{call.callingAddress}}</option>
                        </select>
                        <div class="mb-5 w-100">
                          <div class="text-center py-2">Call to Conference/ Transfer :</div>
                          <h3 class="text-center">{{otherCalls[0].callingAddress}}</h3>
                        </div>
                        <transition name="fade">
                          <div class="btn-group w-100">
                            <mdb-btn class="mdb-color mx-2 px-2 w-50" @click="transferCall">Transfer</mdb-btn>
                            <mdb-btn
                              class="mdb-color mx-2 px-2 w-50"
                              @click="conferenceCall"
                            >Conference</mdb-btn>
                          </div>
                        </transition>
                      </div>
                    </mdb-modal-body>
                  </mdb-modal>
                </mdb-col>

                <!--END: Conference Button-->
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
import OutboundDialer from '@/widgets/Dialer/OutboundDialer'
import CallDisposition from '@/widgets/CallDisposition/CallDisposition'
import PersistTimer from '@/components/agc/PersistTimer.vue'
import Widget from '@/components/agc/Widget'
import {
  CALL_STATES,
  CALL_TYPES,
  SOCKET_EVENTS,
  TIMER_TYPES,
  MULTI_CALL_STATES
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
  mdbInput,
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
  name: 'CallCardOutbound',
  components: {
    Widget,
    PersistTimer,
    ConsultDialer,
    CallDisposition,

    mdbInput,
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
  mounted() {
    if (this.otherCalls.length === 1) {
      this.callIdToBeConferenced = this.otherCalls[0].callId
    } else {
      console.log('not setting callIdToBeConferenced')
    }
  },
  props: {
    ucid: String,
    callId: Number
  },

  data() {
    return {
      showConsultDialer: false,
      showOutboundDialer: false,
      callIdToBeConferenced: null,
      spinner: {
        show: false
      },
      showConferenceModal: false
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
        this.call.callId,
        CALL_TYPES.OUTBOUND
      ])
    },

    holdUnholdCall() {
      this.$store.dispatch('requestHoldUnholdCall', this.call.callId)
    },

    disposeCall() {
      this.$store.dispatch('removeCallFromActiveCalls')
    },

    transferCall() {
      if (this.callIdToBeConferenced && this.callId) {
        let transferRequest = {
          callIdB: this.callId,
          callIdA: this.callIdToBeConferenced
        }
        this.$store.dispatch('requestTransferCall', transferRequest)
      } else {
        console.log(
          'skipping transfer call. this.callId=' +
            this.callId +
            'callIdToBeConferenced=',
          this.callIdToBeConferenced
        )
      }
    },
    conferenceCall() {
      if (this.callIdToBeConferenced && this.callId) {
        let transferRequest = {
          callIdB: this.callId,
          callIdA: this.callIdToBeConferenced
        }
        this.$store.dispatch('requestConferenceCall', transferRequest)
      } else {
        console.log(
          'skipping conference call. this.callId=' +
            this.callId +
            'callIdToBeConferenced=',
          this.callIdToBeConferenced
        )
      }
    }
  },
  computed: {
    cardWidth() {
      return this.$store.getters.getCalls.length > 2 ? 'md-12' : 'md-6'
    },

    //Find the list of calls other than this call. This is used to display the call list in the drop-down for consult call
    otherCalls() {
      let calls = this.$store.getters.getCalls
      let otherCalls = []

      //iterate through all calls, and remove the call that belongs to this call card. Show only other calls.
      for (let i = 0; i < calls.length; i++) {
        if (calls[i].callId !== this.callId) otherCalls.push(calls[i])
      }

      return otherCalls
    },

    callTimerName() {
      return TIMER_TYPES.CALL_TIMER + '_' + this.callId
    },
    inStateTimerName() {
      return TIMER_TYPES.IN_STATE_TIMER + '_' + this.callId
    },

    call() {
      return this.$store.getters.getCallByCallId(this.callId)
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

    multiCallState() {
      return this.$store.getters.getMultiCallState(this.callId)
    },
    isCallConferenced() {
      if (this.multiCallState === MULTI_CALL_STATES.CONFERENCED) {
        return true
      } else {
        return false
      }
    },

    isCallConsulted() {
      return this.callType === CALL_TYPES.CONSULTED
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
          return 'Inbound Call'
        case CALL_TYPES.OUTBOUND:
          return 'Outbound Call'
        case CALL_TYPES.CONSULTED:
          return 'Outbound Call'
      }
    },

    thirdAddress() {
      switch (this.callType) {
        case CALL_TYPES.INBOUND:
          return this.call.thirdAddress
        case CALL_TYPES.OUTBOUND:
          return this.call.thirdAddress
        case CALL_TYPES.CONSULTED:
          return this.call.thirdAddress
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
          'CallCardOutbound(): watcher - callStatus: newCallStatus=' +
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
            this.$store.dispatch('startTimer', this.inStateTimerName)
            break
          case CALL_STATES.TALKING:
          case CALL_STATES.HELD:
            console.log(
              'CallCardOutbound(): watcher - callStatus:  calling stop and start timer for instateTimer'
            )
            // this.$store.dispatch('stopTimer', this.inStateTimerName)
            // this.$store.dispatch('startTimer', this.callTimerName)
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
