<template>
  <mdb-container fluid>
    <mdb-card class="mb-0">
      <mdb-card-header color="special-color">
        Test Bench
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <mdb-card-body class="px-1" v-show-slide="showWidget" :class="{'p-0': !showWidget}">
        <demo-timer :timerName="timerName"></demo-timer>
        <button class="btn btn-primary" @click="startTimer">Start</button>
        <button class="btn btn-danger" @click="stopTimer">Stop</button>
        <button class="btn btn-info" @click="togglePauseResumeTimer">Pause</button>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import DemoTimer from '@/components/widgets/DemoTimer.vue'
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbInput,
  mdbIcon
} from 'mdbvue'
import { AGENT_STATES, CALL_STATES } from '@/defines.js'

export default {
  name: 'TimerTest',
  components: {
    DemoTimer,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbInput,
    mdbIcon
  },
  mounted() {},
  props: {},

  data() {
    return {
      showWidget: true,
      timerName: 'demo'
    }
  },

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    },
    startTimer() {
      this.$store.dispatch('startTimer', this.timerName)
    },
    stopTimer() {
      this.$store.dispatch('stopTimer', this.timerName)
    },

    togglePauseResumeTimer() {
      this.$store.dispatch('togglePauseResumeTimer', this.timerName)
    }
  },
  computed: {
    devMode() {
      return this.$store.state.devMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
