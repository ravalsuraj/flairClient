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
  mounted() {
    if (this.$store.getters.getTimers[this.timerName] === TIMER_STATES.START) {
      Vue
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
      console.log("timer computed called")
      return this.$store.getters.getTimers[this.timerName]
    },
    timerState() {
      return this.timer.state
    },
    refTime: {
      get: function() {
        return this.timer.refTime
      },
      set: function() {}
    }
  },
  watch: {
    refTime: {
      immediate: true,
      deep: true,
      handler: function() {
        console.log('PersistTimer(): refTime watch() called')
        this.resetFormattedTime()
      }
    },
    timerState: {
      immediate: true,
      deep: true,
      handler: function(newState, oldState) {
        console.log('PersistTimer(): timerState watch() called')
        if (newState === TIMER_STATES.START) {
          this.startTicking()
        } else if (newState === TIMER_STATES.STOP) {
          this.stopTicking()
        }
      }
    }
  }
}
</script>
