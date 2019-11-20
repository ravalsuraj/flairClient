<template>
  <widget title="CRM">
    <template v-slot:body>
      <iframe :src="crmUrl" class="w-100 fl_crm_window" style></iframe>
      <!-- <iframe is="x-frame-bypass" :src="crmUrl" class="w-100 fl_crm_window" ></iframe> -->
    </template>
  </widget>
</template>

<script>
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbIcon,
  mdbTbl,
  mdbTblHead,
  mdbTblBody,
  mdbListGroup,
  mdbListGroupItem,
  mdbBadge,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter
} from 'mdbvue'
import { CALL_STATES } from '@/defines'
import { config } from '@/config.js'
import Widget from '@/components/agc/Widget'
export default {
  name: 'CrmFrame',
  components: {
    Widget,
    mdbRow,
    mdbCol,
    mdbContainer,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbIcon,
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbListGroup,
    mdbListGroupItem,
    mdbBadge,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter
  },
  props: {},
  data() {
    return {
      manualShowWidget: true,
      callerName: 'John Doe',
      callerRMN: '+919876512345',
      callerAccountNo: '1234512345',
      callerTransferReason: 'TPIN Generate',
      callerLanguage: 'English'
    }
  },
  methods: {
    toggleShowWidget() {
      if (this.autoShowWidget === false) {
        this.manualShowWidget = !this.manualShowWidget
      }
    }
  },
  computed: {
    autoShowWidget() {
      return (
        this.$store.getters.getPrimaryCall.status === CALL_STATES.RINGING ||
        this.$store.getters.getPrimaryCall.status === CALL_STATES.TALKING
      )
    },

    callingAddress() {
      return this.$store.getters.getPrimaryCall.callingAddress
    },
    calledAddress() {
      return this.$store.getters.getPrimaryCall.calledAddress
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
          '&dnis=067412101&agentId=1501&deviceId=2101'
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
</style>
