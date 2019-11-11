<template>
  <section class="mt-lg-5">
    <div v-for="(call, index) in myCalls">
      <!-- {{call.ucid}} -->
      <call-control-card :callIndex="call.ucid"></call-control-card>
    </div>
  </section>
</template>

<style>
</style>

<script>
import AgentControl from '@/widgets/AgentControl/AgentControl.vue'
import CallControlCard from '@/widgets/CallControl/CallControlCard.vue'
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
