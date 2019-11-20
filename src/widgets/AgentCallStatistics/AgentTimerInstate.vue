<template>
  <up-timer name="agentTimerInstate"></up-timer>
</template>

<style>
.time {
  font-size: 1rem;
}
</style>

<script>
import { AGENT_STATES } from '@/defines.js'
import UpTimer from '@/components/agc/UpTimer.vue'
export default {
  name: 'AgentTimerInstate',
  components: {
    UpTimer
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('startTimer', 'agentTimerInstate')
  },
  destroyed() {},
  computed: {
    agentStatus() {
      return this.$store.getters.getAgentState
    }
  },
  watch: {
    agentStatus(newAgentStatus, oldAgentStatus) {
      console.log(
        'CallTimerInstate()/watch(agentStatus): Changed from: ' +
          oldAgentStatus +
          ' to: ' +
          newAgentStatus
      )
      if (newAgentStatus !== AGENT_STATES.LOG_OUT) {
        this.$store.dispatch('resetTimer', 'agentTimerInstate')
      } else {
        this.$store.dispatch('stopTimer', 'agentTimerInstate')
      }
    }
  },
  methods: {}
}
</script>
