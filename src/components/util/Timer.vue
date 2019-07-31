<template>
  <span id="time" class="time text-unique-color">{{time}}</span>
</template>

<style>
</style>

<script>
import { TIMER_STATES } from '@/defines.js'
export default {
  name: 'Timer',
  props: {
    name: String
  },
  data() {
    return {
      state: 'started',
      startTime: Date.now(),
      currentTime: Date.now(),
      interval: null,
      secondTicks: 0
    }
  },
  mounted() {},
  destroyed() {},
  computed: {
    secondDisplay() {
      return this.padNumber(this.secondTicks % 60)
    },
    minuteDisplay() {
      return this.padNumber(Math.floor((this.secondTicks / 60) % 60))
    },
    hourDisplay() {
      return this.padNumber(Math.floor((this.secondTicks / 3600) % 60))
    },
    time() {
      return (
        this.hourDisplay + ':' + this.minuteDisplay + ':' + this.secondDisplay
      )
    },
    milliseconds() {
      return this.currentTime - this.$data.startTime
    },
    hours() {
      var lapsed = this.milliseconds
      var hrs = Math.floor(lapsed / 1000 / 60 / 60)
      return hrs >= 10 ? hrs : '0' + hrs
    },
    minutes() {
      var lapsed = this.milliseconds
      var min = Math.floor((lapsed / 1000 / 60) % 60)
      return min >= 10 ? min : '0' + min
    },
    seconds() {
      var lapsed = this.milliseconds
      var sec = Math.ceil((lapsed / 1000) % 60)
      return sec >= 10 ? sec : '0' + sec
    },

    timer() {
      let name = this.name
      return this.$store.state.timer[name]
    }
  },
  watch: {
    timer(newTimerCommand, oldTimerCommand) {
      if (oldTimerCommand === TIMER_STATES.STOP) {
        if (newTimerCommand === TIMER_STATES.START) {
          this.startTicking()
        }
      } else if (oldTimerCommand === TIMER_STATES.START) {
        if (newTimerCommand === TIMER_STATES.STOP) {
          this.stopTicking()
        } else if (newTimerCommand === TIMER_STATES.PAUSE) {
          this.pauseTicking()
        } else if (newTimerCommand === TIMER_STATES.START) {
          this.resetTicking()
        }
      } else if (oldTimerCommand === TIMER_STATES.PAUSE) {
        if (newTimerCommand === TIMER_STATES.STOP) {
          this.stopTicking()
        } else if (newTimerCommand === TIMER_STATES.START) {
          this.resumeTicking()
        }
      }
    }
  },
  methods: {
    startTicking() {
      this.updateTicks()
      this.interval = setInterval(this.updateTicks, 1000)
    },
    stopTicking() {
      clearInterval(this.interval)
      this.secondTicks = 0
    },
    resetTicking() {
      this.secondTicks = 0
    },
    pauseTicking() {
      clearInterval(this.interval)
    },
    resumeTicking() {
      this.interval = setInterval(this.updateTicks, 1000)
    },
    updateTicks() {
      this.secondTicks = this.secondTicks + 1
    },
    padNumber(i) {
      return i < 10 ? '0' + i : i
    }
  }
}
</script>
