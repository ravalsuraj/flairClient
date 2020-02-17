<template>
  <widget :title="'CRM -' + CRM_URL">
    <template v-slot:body>
      <div class="wrapper">
        <iframe :src="CRM_URL" class="w-100 fl_crm_window"></iframe>
      </div>
    </template>
  </widget>
</template>

<script>
import { CALL_STATES } from "@/defines";
import Widget from "@/components/agc/Widget";
export default {
  name: "CrmFrame",
  components: {
    Widget
  },
  props: {},
  data() {
    return {
      manualShowWidget: true,
      iframeError: false,
      crmUrl: null
    };
  },
  methods: {
    toggleShowWidget() {
      if (this.autoShowWidget === false) {
        this.manualShowWidget = !this.manualShowWidget;
      }
    }
  },
  computed: {
    autoShowWidget() {
      return (
        this.$store.activeCall.status === CALL_STATES.RINGING || this.$store.activeCall.status === CALL_STATES.TALKING
      );
    },
    activeCall() {
      let callId = this.$store.getters.getActiveCallCallId;

      return this.$store.getters.getCallByCallId(callId);
    },
    callingAddress() {
      return this.activeCall ? this.activeCall.callingAddress : null;
    },
    calledAddress() {
      return this.activeCall ? this.activeCall.calledAddress : null;
    },
    agentCredentials() {
      return this.$store.getters.getAgentCredentials;
    },
    showWidget() {
      return this.manualShowWidget || this.autoShowWidget;
    },
    sessionId() {
      return this.$store.getters["session/getSessionId"];
    },

    CRM_URL() {
      // return "http://localhost:4000"
      //return this.$store.getters.getDgftCrmUrlByCallIndex;
      // if (this.callingAddress) {
      //   return (
      //     "http://localhost:4000" +
      //     "?cli=" +
      //     this.callingAddress +
      //     "&dnis=" +
      //     this.calledAddress +
      //     "&ucid=" +
      //     this.activeCall.ucid +
      //     "&callId=" +
      //     this.activeCall.callId +
      //     "&sessionId=" +
      //     this.sessionId
      //   );
      // } else {
      if (this.$store.getters.getSelectedDgftCrmUrl) {
        return this.$store.getters.getSelectedDgftCrmUrl;
      } else {
        return this.$store.getters["session/getConfig"].DGFT.CRM.URL;
      }

      // }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fl_crm_window {
  border: none;
  height: 500px;
}

.wrapper {
  position: relative;
  height: 500px;
  border: none;
  height: 500px;
}
.wrapper > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.wrapper > iframe.error {
  width: 0%;
  height: 0%;
}
</style>
