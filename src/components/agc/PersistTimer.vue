<template>
  <div>
    <span>{{formattedTime}}</span>
  </div>
</template>

<script>
import { TIMER_STATES } from '@/defines.js'
export default {
  name: 'PersistTimer',
  props: {
    timerName: String
  },
  data() {
    return {
      formattedTime: '00:00:00',
      timerInterval: null
    }
  },
  beforeMount() {
    if (this.timerState === TIMER_STATES.START) {
      this.startTicking()
    }
  },
  methods: {
    resetFormattedTime() {
      this.formattedTime = '00:00:00'
    },
    startTicking() {
      this.updateTicks()
      this.timerInterval = setInterval(this.updateTicks, 1000)
    },
    stopTicking() {
      clearInterval(this.timerInterval)
      this.resetFormattedTime()
    },
    updateTicks() {
      let secondMillis = new Date().getTime() - this.refTime
      let seconds = Math.floor(secondMillis / 1000) % 60

      let minutes = Math.floor(secondMillis / 1000 / 60) % 60
      let hours = Math.floor(minutes / 60) % 12
      this.formattedTime =
        '' +
        this.padNumber(hours) +
        ':' +
        this.padNumber(minutes) +
        ':' +
        this.padNumber(seconds)
    },
    padNumber(i) {
      return i < 10 ? '0' + i : i
    }
  },
  computed: {
    timer() {
      return this.$store.getters.getTimers[this.timerName]
    },
    timerState() {
      return this.timer.state
    },
    refTime() {
      return this.$store.getters.getTimers[this.timerName].refTime
    }
  },
  watch: {
    refTime: {
      immediate: true,
      handler: function() {
        this.resetFormattedTime()
      }
    },
    timerState: {
      immediate: true,
      handler: function(newState, oldState) {
        if (oldState === TIMER_STATES.STOP && newState === TIMER_STATES.START) {
          this.startTicking()
        } else if (
          oldState === TIMER_STATES.START &&
          newState === TIMER_STATES.STOP
        ) {
          this.stopTicking()
        }
      }
    }
  }
}
</script>
