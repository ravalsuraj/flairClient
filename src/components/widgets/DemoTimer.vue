<template>
  <span id="time" class="time text-unique-color">{{time}}</span>
</template>

<style>
.time {
  font-size: 1rem;
}
</style>

<script>
import { CALL_STATES } from '@/defines.js'
export default {
  name: 'DemoTimer',
  props: {
    timerName: String
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
      let timerName = this.timerName

      return this.$store.state.timer[timerName]
    }
  },
  watch: {
    timer(newTimerCommand, oldTimerCommand) {
      console.log(
        'Call Status Changed from:' + oldTimerCommand + ' to:' + newTimerCommand
      )
      if (oldTimerCommand === 0) {
        if (newTimerCommand === 1) {
          this.startTicking()
        }
      } else if (oldTimerCommand === 1) {
        if (newTimerCommand === 0) {
          this.stopTicking()
        } else if (newTimerCommand === 2) {
          this.pauseTicking()
        }
      } else if (oldTimerCommand === 2) {
        if (newTimerCommand === 0) {
          this.stopTicking()
        } else if (newTimerCommand === 1) {
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
