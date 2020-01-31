<template>
  <widget title="CRM">
    <template v-slot:body>
      <div class="wrapper">
        <div class="fallback px-5 py-5 mx-auto w-100 d-flex align-items-center">
          <h1
            class="blue-text py-3 my-5 text-center"
          >The CRM could not be loaded. Please ensure that your CRM is accesible</h1>
          <img
            alt="Error 404"
            class="img-fluid ml-5 pl-5"
            src="https://mdbootstrap.com/img/Others/grafika404-bf.png"
          />
        </div>
        <iframe
          :src="crmUrl"
          class="w-100 fl_crm_window"
          @error="iframeError"
          :class="{'error': iframeError}"
        ></iframe>
      </div>
    </template>
  </widget>
</template>

<script>
import { mdbRow } from 'mdbvue'
import { CALL_STATES } from '@/defines'
import { config } from '@/config.js'
import Widget from '@/components/agc/Widget'
export default {
  name: 'CrmFrame',
  components: {
    Widget
  },
  props: {},
  data() {
    return {
      manualShowWidget: true,
      iframeError: true
    }
  },
  methods: {
    toggleShowWidget() {
      if (this.autoShowWidget === false) {
        this.manualShowWidget = !this.manualShowWidget
      }
    },

    //used to detect whether the frame has loaded. if not, show a friendly error message
    iframeLoad(e) {
      this.iframeError = true
      // if (e.timeStamp < 1000) {
      //   this.iframeError = true
      // }
    }
  },
  computed: {
    autoShowWidget() {
      return (
        this.$store.activeCall.status === CALL_STATES.RINGING ||
        this.$store.activeCall.status === CALL_STATES.TALKING
      )
    },
    activeCall() {
      let activeCall = {
        responseCode: '0',
        responseMessage: 'Success',
        callId: 0,
        ucid: '',
        callingAddress: '',
        calledAddress: '',
        status: '',
        type: '',
        startTime: 1574832886343
      }

      if (this.$store.getters.getActiveCall) {
        let ucid = this.$store.getters.getActiveCall.ucid
        if (this.$store.getters.getCallByUcid(ucid)) {
          activeCall = this.$store.getters.getCallByUcid(ucid)
        }
      }
      return activeCall
    },
    callingAddress() {
      return this.activeCall.callingAddress
    },
    calledAddress() {
      return this.activeCall.calledAddress
    },
    agentCredentials() {
      return this.$store.getters.getAgentCredentials
    },
    showWidget() {
      return this.manualShowWidget || this.autoShowWidget
    },

    crmUrl() {
      //return this.$store.getters.getComputedCrmUrl
      if (this.callingAddress) {
        return (
          this.$store.getters.getCrmUrl +
          '?cli=' +
          this.callingAddress +
          '&dnis=' +
          this.calledAddress +
          '&agentId=' +
          this.agentCredentials.agentId +
          '&deviceId=' +
          this.agentCredentials.deviceId
        )
      } else {
        return this.$store.getters.getCrmUrl
      }
    }
  }
}
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
