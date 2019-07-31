<template>
  <span id="time" class="time text-unique-color">{{time}}</span>
</template>

<style>
.time {
  font-size: 1rem;
}
</style>

<script>
import { CALL_STATES } from "@/defines.js";
export default {
  name: "CallTimer",
  data() {
    return {
      state: "started",
      startTime: Date.now(),
      currentTime: Date.now(),
      interval: null
    };
  },
  mounted() {},
  destroyed() {},
  computed: {
    time() {
      return this.hours + ":" + this.minutes + ":" + this.seconds;
    },
    milliseconds() {
      return this.currentTime - this.$data.startTime;
    },
    hours() {
      var lapsed = this.milliseconds;
      var hrs = Math.floor(lapsed / 1000 / 60 / 60);
      return hrs >= 10 ? hrs : "0" + hrs;
    },
    minutes() {
      var lapsed = this.milliseconds;
      var min = Math.floor((lapsed / 1000 / 60) % 60);
      return min >= 10 ? min : "0" + min;
    },
    seconds() {
      var lapsed = this.milliseconds;
      var sec = Math.ceil((lapsed / 1000) % 60);
      return sec >= 10 ? sec : "0" + sec;
    },

    callStatus() {
      return this.$store.getters.getPrimaryCall.status;
    }
  },
  watch: {
    callStatus(newCallStatus, oldCallStatus) {
      console.log(
        "Call Status Changed from:" + oldCallStatus + " to:" + newCallStatus
      );
      if (
        oldCallStatus === CALL_STATES.RINGING &&
        newCallStatus === CALL_STATES.TALKING
      ) {
        this.reset();
        this.interval = setInterval(this.updateCurrentTime, 1000);
      } else if (
        newCallStatus === CALL_STATES.DROPPED ||
        newCallStatus === CALL_STATES.IDLE
      ) {
        clearInterval(this.interval);
        this.reset();
      } else {
        // this.reset();
      }
    }
  },
  methods: {
    reset() {
      this.$data.state = "started";
      this.$data.startTime = Date.now();
      this.$data.currentTime = Date.now();
    },
    pause() {
      this.$data.state = "paused";
    },
    resume() {
      this.$data.state = "started";
    },
    updateCurrentTime() {
      if (this.$data.state === "started") {
        this.currentTime = Date.now();
      }
    }
  }
};
</script>
