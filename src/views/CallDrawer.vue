<template>
  <section>
    <mdb-container fluid v-if="myCalls && myCalls.length > 0">
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
    </mdb-container>
    <div class="float-right" end v-else>
      <dialer-toggle></dialer-toggle>
    </div>
  </section>
</template>

<style></style>

<script>
import _ from "lodash.debounce";

import CallCardInbound from "@/widgets/CallControl/CallCardInbound.vue";
import CallCardOutbound from "@/widgets/CallControl/CallCardOutbound.vue";
import DialerToggle from "@/widgets/Dialer/DialerToggle.vue";
import DgftDisposition from "@/widgets/DGFT/DgftDisposition.vue";

import { CALL_STATES, CALL_TYPES } from "@/defines.js";
import { mdbRow, mdbCol, mdbContainer } from "mdbvue";
export default {
  name: "CallDrawer",
  components: {
    CallCardInbound,
    CallCardOutbound,
    DgftDisposition,
    DialerToggle,
    mdbRow,
    mdbCol,
    mdbContainer
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
      this.serverLog("CallDrawer()/watch(myCalls): call state changed to:", newState);
    }
  }
};
</script>
