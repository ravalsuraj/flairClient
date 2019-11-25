<template>
  <section class="mt-lg-5">
    <mdb-container>
      <mdb-row>
        <mdb-col col="3" v-for="call in myCalls" :key="call.ucid">
          <!-- {{call.ucid}} -->
          <call-control-card v-if="!isCallDropped(call)" :ucid="call.ucid" ></call-control-card>
          <call-disposition v-else :ucid="call.ucid" ></call-disposition>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </section>
</template>

<style>
</style>

<script>
import AgentControl from '@/widgets/AgentControl/AgentControl.vue'
import CallControlCard from '@/widgets/CallControl/CallControlCard.vue'
import CallDisposition from '@/widgets/CallDisposition/CallDisposition'
import { CALL_STATES } from '@/defines.js'
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
    CallControlCard,
    CallDisposition,
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
    }
  },
  computed: {
    myCalls() {
      return this.$store.getters.getCalls
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
