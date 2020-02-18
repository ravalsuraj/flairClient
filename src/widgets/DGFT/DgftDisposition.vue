<template>
  <widget title="Call Disposition">
    <template v-slot:body>
      <mdb-container fluid>
        <div v-if="isAgentInAcw">
          <mdb-row>
            <mdb-col col="8">
              <span>
                Please dispose the call on the CRM to clear this call and go on "Ready"<br />In case of issues, use the
                DISPOSE button here 
              </span>
            </mdb-col>
            <mdb-col col="4">
              <mdb-btn class="float-right" color="mdb-color" @click="disposeCall">Dispose</mdb-btn>
            </mdb-col>
          </mdb-row>
        </div>
        <div v-else>
          <h4 class="grey-text">Available when call ends</h4>
        </div>
      </mdb-container>
    </template>
  </widget>
</template>

<script>
import { mdbContainer, mdbBtn, mdbRow, mdbCol } from "mdbvue";
import { CALL_STATES } from "@/defines.js";

import Widget from "@/components/agc/Widget";
export default {
  name: "DgftDisposition",
  components: {
    Widget,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn
  },
  mounted() {},
  props: {
    ucid: null,
    callId: null
  },

  data() {
    return {
      showWidget: false,
      showTimer: false,
      disposition: null,
      sub_disposition: null
    };
  },

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget;
    },
    onAcwTimerExpired() {
      this.showTimer = false;
      this.disposeCall();
    },
    disposeCall() {
      // let dispositionRequest = {
      //   callId: this.callId,
      //   ucid: this.ucid,
      //   cli : this.call.callingAddress,
      //   dnis : this.call.calledAddress,

      //   call_start_date_time: this.call.callStartTime,
      //   call_end_date_time: this.call.callEndTime,
      //   disposition : this.disposition,
      //   sub_disposition : this.sub_disposition

      // }
      //this.$store.dispatch('requestCallDisposition')
      this.$store.dispatch("removeCallFromActiveCalls", [this.ucid, this.callId]);
    }
  },

  computed: {
    call() {
      return this.$store.getters.getCallByCallId(this.callId);
    },
    callStatus() {
      return this.call.status;
    },
    isAgentInAcw() {
      return this.callStatus === CALL_STATES.DROPPED;
    }
  },

  watch: {
    callStatus(newCallStatus, oldCallStatus) {
      switch (oldCallStatus) {
        case CALL_STATES.TALKING:
        case CALL_STATES.HELD:
          if (newCallStatus === CALL_STATES.DROPPED) {
            console.log("timer changed from talking to dropped");
            this.showWidget = true;
            this.showTimer = true;
            this.$store.dispatch("startTimer", "acwTimer");
          }
          break;
        default:
          //this.$store.dispatch('stopTimer', 'acwTimer')
          break;
      }
    }
  }
};
</script>
