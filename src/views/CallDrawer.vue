<template>
  <section>
    <mdb-container fluid>
      <!-- <mdb-row>
        <timer-test></timer-test>
      </mdb-row>-->

      <mdb-row>
        <mdb-col :col="cardWidth" v-for="call in myCalls" :key="call.callId">
          <call-card-inbound
            v-if="!isCallDropped(call) && isCallTypeInbound(call)"
            :ucid="call.ucid"
            :callId="call.callId"
          ></call-card-inbound>
          <call-card-outbound
            v-if="!isCallDropped(call) && isCallTypeOutbound(call)"
            :ucid="call.ucid"
            :callId="call.callId"
          ></call-card-outbound>
          <call-disposition v-if="isCallDropped(call)" :ucid="call.ucid" :callId="call.callId"></call-disposition>
        </mdb-col>
        <mdb-col class="fl_navbar_item">
          <mdb-btn class="btn-circle light-blue" @click.native="openOutboundModal">
            <mdb-icon icon="phone" style="font-size:1.5em" />
            <mdb-icon icon="plus" style="font-size:1em" />
          </mdb-btn>
          <mdb-modal
            size="sm"
            v-if="showOutboundDialerModal"
            @close="showOutboundDialerModal = false"
          >
            <mdb-modal-header class="black-text">
              <mdb-modal-title>Make Call</mdb-modal-title>
            </mdb-modal-header>
            <mdb-modal-body>
              <outbound-dialer @close-self="showOutboundDialerModal = false"></outbound-dialer>
            </mdb-modal-body>
          </mdb-modal>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </section>
</template>

<style>
</style>

<script>
import _ from 'lodash'
import AgentControl from '@/widgets/AgentControl/AgentControl.vue'
import CallCardInbound from '@/widgets/CallControl/CallCardInbound.vue'
import CallCardOutbound from '@/widgets/CallControl/CallCardOutbound.vue'
import CallDisposition from '@/widgets/CallDisposition/CallDisposition'
import OutboundDialer from '@/widgets/Dialer/OutboundDialer.vue'

import { CALL_STATES, CALL_TYPES } from '@/defines.js'
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbCard,
  mdbCardTitle,
  mdbCardHeader,
  mdbCardText,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
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
    OutboundDialer,

    mdbRow,
    mdbCol,
    mdbContainer,
    mdbCard,
    mdbCardTitle,
    mdbCardHeader,
    mdbCardText,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
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
      calls: null,
      showOutboundDialerModal: false
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
    },

    openOutboundModal: _.debounce(
      function() {
        this.showOutboundDialerModal = true
      },
      2000,
      { leading: true, trailing: true }
    )
  },
  computed: {
    myCalls() {
      return this.$store.getters.getCalls
    },
    cardWidth() {
      return this.myCalls.length > 2 ? 'lg-3' : 'lg-5'
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
