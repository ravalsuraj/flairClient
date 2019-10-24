<template>
  <up-timer name="callTimerInstate"></up-timer>
</template>

<style>
.time {
  font-size: 1rem;
}
</style>

<script>
import { CALL_STATES } from '@/defines.js'
import UpTimer from '@/components/util/UpTimer.vue'
export default {
  name: 'CallTimerInstate',
  components: {
    UpTimer
  },
  data() {
    return {}
  },
  mounted() {
    this.$store.dispatch('startTimer', 'callTimerInstate')
  },
  destroyed() {},
  computed: {
    callStatus() {
      return this.$store.getters.getCallStatus
    }
  },
  watch: {
    callStatus(newCallStatus, oldCallStatus) {
      console.log(
        'CallTimerInstate()/watch(callStatus): Changed from: ' +
          oldCallStatus +
          ' to: ' +
          newCallStatus
      )
      if (newCallStatus !== CALL_STATES.DROPPED) {
        this.$store.dispatch('resetTimer', 'callTimerInstate')
      } else {
        this.$store.dispatch('stopTimer', 'callTimerInstate')
      }
    }
  },
  methods: {}
}
</script>
