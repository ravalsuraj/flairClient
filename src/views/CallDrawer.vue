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
          <dgft-disposition v-if="isCallDropped(call)" :ucid="call.ucid" :callId="call.callId"></dgft-disposition>
        </mdb-col>
      </mdb-row>
      <span class="float-right">
        <!-- <mdb-btn class="btn-circle light-blue" @click.native="openOutboundModal">
          
          <mdb-icon icon="plus" style="font-size:1.5em" />
        </mdb-btn> -->
        <mdb-modal size="sm" v-if="showOutboundDialerModal" @close="showOutboundDialerModal = false">
          <mdb-modal-header class="black-text">
            <mdb-modal-title>Make Call</mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body>
            <outbound-dialer @close-self="showOutboundDialerModal = false"></outbound-dialer>
          </mdb-modal-body>
        </mdb-modal>
      </span>
      <div class="float-right" end>
        <!-- <mdb-dropdown-toggle slot="toggle" color="secondary">Dropdown link</mdb-dropdown-toggle> -->
        <mdb-btn
          v-if="isOutCallingEnabled"
          class="btn-circle btn-lg"
          :color="showOutboundDialerDropdown?'cyan':'mdb-color'"
          @click.native="showOutboundDialerDropdown = !showOutboundDialerDropdown"
        >
          <!-- <mdb-icon icon="phone" style="font-size:1em" /> -->
          <mdb-icon
            icon="phone"
            style="font-size:1.7em"
            class="white-text fl_rotating_icon"
            :class="{ active: showOutboundDialerDropdown }"
          />
        </mdb-btn>
        <!-- <transition name="fade" mode="out-in"> -->
        <scale-transition origin="top right">
          <div class=" fl_dropdown" v-if="showOutboundDialerDropdown">
            <mdb-card>
              <mdb-card-header color="cyan darken-1" class="pt-4"
                ><h4><strong>Make Outbound Call</strong></h4></mdb-card-header
              >
              <mdb-card-body>
                <outbound-dialer></outbound-dialer>
              </mdb-card-body>
            </mdb-card>
          </div>
        </scale-transition>
        <!-- </transition> -->
      </div>
    </mdb-container>
  </section>
</template>

<style></style>

<script>
import _ from "lodash.debounce";
import { ScaleTransition } from "vue2-transitions";
import CallCardInbound from "@/widgets/CallControl/CallCardInbound.vue";
import CallCardOutbound from "@/widgets/CallControl/CallCardOutbound.vue";
import DgftDisposition from "@/widgets/DGFT/DgftDisposition.vue";
import OutboundDialer from "@/widgets/Dialer/OutboundDialer.vue";

import { CALL_STATES, CALL_TYPES } from "@/defines.js";
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbBtn,
  mdbIcon,
  mdbCard,
  mdbCardBody,
  mdbCardHeader
} from "mdbvue";
export default {
  name: "CallDrawer",
  components: {
    CallCardInbound,
    CallCardOutbound,
    DgftDisposition,
    OutboundDialer,
    ScaleTransition,
    mdbRow,
    mdbCol,
    mdbContainer,

    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbBtn,
    mdbIcon,

    mdbCard,
    mdbCardBody,
    mdbCardHeader
  },

  props: {},

  data() {
    return {
      calls: null,
      showOutboundDialerModal: false,
      showOutboundDialerDropdown: false
    };
  },
  methods: {
    isCallDropped(call) {
      return call.status === CALL_STATES.DROPPED;
    },
    isCallTypeInbound(call) {
      return call.type === CALL_TYPES.INBOUND;
    },
    isCallTypeOutbound(call) {
      return call.type !== CALL_TYPES.INBOUND;
    },

    openOutboundModal: _(
      function() {
        this.showOutboundDialerModal = true;
      },
      2000,
      { leading: true, trailing: true }
    )
  },
  computed: {
    isOutCallingEnabled() {
      return this.$store.getters["session/getConfig"].ALLOW_OUTBOUND_DIALING;
    },
    myCalls() {
      return this.$store.getters.getCalls;
    },
    cardWidth() {
      return this.myCalls.length > 2 ? "lg-3" : "lg-5";
    }
  },
  watch: {
    myCalls(newState) {
      console.log("CallDrawer()/watch(myCalls): call state changed to:", newState);
    }
  }
};
</script>
