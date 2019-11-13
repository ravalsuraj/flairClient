<template>
  <div class="fl_container_callControl d-flex align-items-center">
    <mdb-container fluid v-if="isCallActive || isCallRinging">
      <mdb-card class="card-body" style="width: 22rem; margin-top: 1rem;">
      
      <mdb-card-header color="special-color">
        {{callingAddress}}
        <a @click="toggleShowWidget">
          <mdb-icon v-if="showWidget" icon="phone" class="float-right"></mdb-icon>
          <!-- <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition> -->
        </a>
      </mdb-card-header>
        <mdb-card-text>{{callingAddress}} : ({{callStatusText}})</mdb-card-text>        <!--START: Inbound Call Controls-->
        <mdb-col col="md-12">
          <!-- <div class="btn-group mx-4" role="group"> </div> -->
          <!-- START: Answer/Drop Button -->
          <transition name="fade">
            <button
              type="button"
              class="btn btn-rounded"
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
          <!-- END: Answer/Drop Button -->

          <!-- START: Hold Button -->
          <transition name="fade">
            <button
              type="checkbox"
              class="btn"
              :disabled="!isCallActive"
              @click="holdUnholdCall"
              :class="holdButtonColor"
            >
              <mdb-icon :icon="isCallHeld?'play':'pause'" style="font-size:1.5em" />
            </button>
          </transition>
          <!--END: Hold Button-->
        </mdb-col>

        <!-- <div class="flex-row">
          <mdb-btn color="cyan" @click="disposeCall">Dispose</mdb-btn>
        </div> -->
      </mdb-card>
    </mdb-container>
  </div>
</template>

<script>
import ConsultDialer from '@/widgets/Dialer/ConsultDialer'
import OutboundDialer from '@/widgets/Dialer/OutboundDialer'
import UpTimer from '@/components/util/UpTimer'
import DownTimer from '@/components/util/DownTimer'

import { CALL_STATES, CALL_TYPES, SOCKET_EVENTS } from '@/defines.js'

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
  name: 'CallControlCard',
  components: {
    UpTimer,
    ConsultDialer,
    OutboundDialer,

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
      showConsultDialer: false,
      showOutboundDialer: false,
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
        this.$store.getters.getPrimaryCall.ucid,
        CALL_TYPES.PRIMARY
      ])
    },
    holdUnholdCall() {
      this.$store.dispatch('requestHoldUnholdCall', [
        this.$store.getters.getPrimaryCall.ucid,
        CALL_TYPES.PRIMARY
      ])
    },

    disposeCall() {
      this.$store.dispatch('removeCallFromActiveCalls')
    }
  },
  computed: {
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
    holdButtonColor() {
      if (this.isCallHeld) {
        return { 'blue-grey': true }
      } else {
        return { cyan: true }
      }
    },
    callingAddress() {
      if (this.isCallRinging || this.isCallActive) {
        return this.call.callingAddress
      } else {
        return '-'
      }
    },

    callStatusText() {
      return CALL_STATES.Text[this.callStatus]
    }
  },
  watch: {
    callStatus(newCallStatus, oldCallStatus) {
      switch (oldCallStatus) {
        case CALL_STATES.IDLE:
        case CALL_STATES.UNKNOWN:
          break
        case CALL_STATES.RINGING:
          if (newCallStatus === CALL_STATES.TALKING) {
            this.$store.dispatch('startTimer', 'callStateTimer')
          }
        default:
          if (
            newCallStatus === CALL_STATES.IDLE ||
            newCallStatus === CALL_STATES.UNKNOWN ||
            newCallStatus === CALL_STATES.DROPPED
          ) {
            this.$store.dispatch('stopTimer', 'callStateTimer')
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
  color: rgba(255, 255, 255, 0.75);
  padding-right: 10px;
  padding-left: 10px;
  font-family: 'Unica One', sans-serif;
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
