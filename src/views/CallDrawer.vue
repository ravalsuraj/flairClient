<template>
  <section>
    <mdb-container fluid>
      <!-- <mdb-row>
        <timer-test></timer-test>
      </mdb-row> -->

      <mdb-row>
        <mdb-col :col="cardWidth" v-for="call in myCalls" :key="call.ucid">
          <call-card-inbound
            v-if="!isCallDropped(call) && isCallTypeInbound(call)"
            :ucid="call.ucid" :callId="call.callId"
          ></call-card-inbound>
          <call-card-outbound
            v-if="!isCallDropped(call) && isCallTypeOutbound(call)"
            :ucid="call.ucid" :callId="call.callId"
          ></call-card-outbound>
          <!-- <call-disposition v-if="isCallDropped(call)" :ucid="call.ucid"></call-disposition> -->
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </section>
</template>

<style>
</style>

<script>
import AgentControl from '@/widgets/AgentControl/AgentControl.vue'
import CallCardInbound from '@/widgets/CallControl/CallCardInbound.vue'
import CallCardOutbound from '@/widgets/CallControl/CallCardOutbound.vue'
import CallDisposition from '@/widgets/CallDisposition/CallDisposition'
import TimerTest from '@/components/agc/TimerTest.vue'

import { CALL_STATES, CALL_TYPES } from '@/defines.js'
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbCard,
  mdbCardTitle,
  mdbCardHeader,
  mdbCardText,
  mdbNavbar,
  mdbNavbarBrand,
  mdbNavItem,
  mdbNavbarNav,
  mdbNavbarToggler,
  mdbBtn,
  mdbIcon,
  mdbListGroup,
  mdbListGroupItem,
  mdbCardBody,
  mdbFooter,
  waves
} from 'mdbvue'
export default {
  name: 'CallDrawer',
  components: {
    AgentControl,
    CallCardInbound,
    CallCardOutbound,
    CallDisposition,

    TimerTest,
    mdbRow,
    mdbCol,
    mdbContainer,
    mdbCard,
    mdbCardTitle,
    mdbCardHeader,
    mdbCardText,
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbBtn,
    mdbIcon,
    mdbListGroup,
    mdbListGroupItem,
    mdbCardBody,
    mdbFooter,
    waves,
    ftr: mdbFooter
  },

  props: {},

  data() {
    return {
      calls: null
    }
  },
  methods: {
    toggleDevMode() {
      this.$store.commit('TOGGLE_DEV_MODE')
    },
    isCallDropped(call) {
      return call.status === CALL_STATES.DROPPED
    },
    isCallTypeInbound(call) {
      return call.type === CALL_TYPES.INBOUND
    },
    isCallTypeOutbound(call) {
      return call.type !== CALL_TYPES.INBOUND
    }
  },
  computed: {
    myCalls() {
      return this.$store.getters.getCalls
    },
    cardWidth() {
      return this.myCalls.length > 2 ? 'md-3' : 'md-6'
    }
  },
  watch: {
    myCalls(newState, oldState) {
      console.log(
        'CallDrawer()/watch(myCalls): call state changed to:',
        newState
      )
    }
  }
}
</script>
