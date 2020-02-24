<template>
  <div>
    <mdb-btn
      v-if="isOutCallingEnabled"
      class="btn-circle btn-lg"
      :color="showOutboundDialerDropdown ? 'cyan' : 'mdb-color'"
      @click.native="showOutboundDialerDropdown = !showOutboundDialerDropdown"
    >
      <mdb-icon
        icon="phone"
        style="font-size:1em"
        class="white-text fl_rotating_icon"
        :class="{ active: showOutboundDialerDropdown }"
      />
    </mdb-btn>
    <!-- <transition name="fade" mode="out-in"> -->
    <scale-transition origin="top right">
      <div class=" fl_dropdown" v-if="showOutboundDialerDropdown" >
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
</template>
<script>
import OutboundDialer from "@/widgets/Dialer/OutboundDialer.vue";
import { ScaleTransition } from "vue2-transitions";
import { mdbCard, mdbCardHeader, mdbCardBody, mdbBtn, mdbIcon } from "mdbvue";
export default {
  name: "DialerToggle",
  components: {
    OutboundDialer,
    ScaleTransition,
    mdbCard,
    mdbCardHeader,
    mdbCardBody,
    mdbBtn,
    mdbIcon
  },
  data() {
    return {
      showOutboundDialerDropdown: false
    };
  },
  computed: {
    isOutCallingEnabled() {
      return this.$store.getters["session/getConfig"].ALLOW_OUTBOUND_DIALING;
    }
  }
};
</script>
