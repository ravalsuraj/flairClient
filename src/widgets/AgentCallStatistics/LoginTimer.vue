<template>
  <span id="time">{{time}}</span>
</template>

<style>
.time {
  font-size: 1rem;
}
</style>

<script>
import { AGENT_STATES } from "@/defines.js";

export default {
  name: "LoginTimer",
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
      return this.$store.getters.getAgent.status;
    }
  },
  watch: {
    agentStatus(newAgentStatus) {
      console.log("Agent Status Changed to:" + newAgentStatus);
      if (newAgentStatus === AGENT_STATES.LOG_IN) {
        this.reset();
        this.interval = setInterval(this.updateCurrentTime, 1000);
      } else if (newAgentStatus === AGENT_STATES.LOG_OUT) {
        this.reset();
        clearInterval(this.interval);
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
