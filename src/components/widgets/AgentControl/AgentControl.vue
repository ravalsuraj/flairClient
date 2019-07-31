<template>
  <span class="d-flex">
    <agent-state-control></agent-state-control>
    <agent-profile></agent-profile>
  </span>
</template>

<script>

import AgentStateControl from './AgentStateControl.vue'
import AgentProfile from './AgentProfile.vue'
import { AGENT_STATES } from '@/defines'

export default {
  name: 'AgentControl',
  components: {
    AgentStateControl,
    AgentProfile
  },
  props: {},
  data() {
    return {}
  },
  methods: {},
  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
