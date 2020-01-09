

<template>
  <mdb-navbar text="white" color="special" position="bottom" dark>
    <web-socket-indicator class="white-text mr-4 pr-4"></web-socket-indicator>
    <span class="white-text">SessionID: {{sessionId}}</span>
  </mdb-navbar>
</template>
<style>
</style>

<script>

import WebSocketIndicator from '@/components/agc/WebSocketIndicator'
import {
  mdbNavbar,

} from 'mdbvue'
export default {
  name: 'UtilityBar',
  components: {
    WebSocketIndicator,
    
    mdbNavbar,

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
