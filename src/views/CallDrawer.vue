<template>
  <section class="mt-lg-5">
    <mdb-card class="card-body" style="width: 22rem; margin-top: 1rem;">
      <mdb-card-title>Panel Title</mdb-card-title>
      <mdb-card-text>Some quick example text to build on the panel title and make up the bulk of the panel's content.</mdb-card-text>
      <div class="flex-row">
        <a>Card link</a>
        <a style="margin-left: 1.25rem">Another link</a>
      </div>
    </mdb-card>
  </section>
</template>

<style>
</style>

<script>
import AgentControl from '@/widgets/AgentControl/AgentControl.vue'
import CallControl from '@/widgets/CallControl/CallControl.vue'
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbCard,
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
    CallControl,
    mdbRow,
    mdbCol,
    mdbContainer,
    mdbCard,
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
    return {}
  },
  methods: {
    toggleDevMode() {
      this.$store.commit('TOGGLE_DEV_MODE')
    }
  }
}
</script>
