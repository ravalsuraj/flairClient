

<template>
  <mdb-navbar text="white" color="special" position="bottom" dark>
    <web-socket-indicator class="white-text mr-4 pr-4"></web-socket-indicator>
    <span class="white-text">SessionID: {{sessionId}}</span>

    <mdb-navbar-nav right>
      <mdb-nav-item href="#" class>Dialer</mdb-nav-item>
    </mdb-navbar-nav>
  </mdb-navbar>
</template>
<style>
</style>

<script>
import AgentControl from '@/components/widgets/AgentControl/AgentControl.vue'
import CallControl from '@/components/widgets/CallControl/CallControl.vue'
import QuickLinks from '@/components/widgets/QuickLinks/QuickLinks.vue'
import WebSocketIndicator from '@/components/util/WebSocketIndicator'
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
  name: 'UtilityBar',
  components: {
    AgentControl,
    CallControl,
    QuickLinks,
    WebSocketIndicator,
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
  methods: {},
  computed: {
    sessionId() {
      return this.$store.getters['session/getSessionId']
    }
  }
}
</script>
