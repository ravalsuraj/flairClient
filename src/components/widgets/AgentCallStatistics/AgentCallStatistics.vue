<template>
  <mdb-container fluid>
    <mdb-card class="mb-0">
      <mdb-card-header color="special-color text-white">
        Agent & Call Statistics
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <mdb-card-body class="p-0 m-0" v-show-slide="showWidget">
        <mdb-container>
          <!-- <mdb-row>
            <span class="ml-0 my-2 mx-auto fl_statHeading">Session Statistics</span>
          </mdb-row>

          <mdb-row class="my-2">
            <dl class="row mb-0 no-gutters"
              <div class="fl_statName">Time since Login</div>
              <div class="fl_statTimer">00:38:43</div>
            </mdb-col>
            <dl class="row mb-0 no-gutters"
              <div class="fl_statName">Time On Call</div>
              <div class="fl_statTimer">00:30:05</div>
            </mdb-col>
          </mdb-row>
          <mdb-row>
            <span class="ml-0 my-2 mx-auto fl_statHeading">Agent Statistics</span>
          </mdb-row>

          <mdb-row>
            <dl class="row mb-0 no-gutters"
              <div class="fl_statName">Agent State</div>
              <div class="fl_statTimer">READY</div>
            </mdb-col>
            <dl class="row mb-0 no-gutters"
              <div class="fl_statName">In-State Time</div>
              <div class="fl_statTimer">00:00:00</div>
            </mdb-col>
          </mdb-row>
          <mdb-row>
            <dl class="row mb-0 no-gutters"
              <div class="fl_statName">Aux Time</div>
              <div class="fl_statTimer">00:00:00</div>
            </mdb-col>
            <dl class="row mb-0 no-gutters"
              <div class="fl_statName">ACW Time</div>
              <div class="fl_statTimer">00:00:00</div>
            </mdb-col>
          </mdb-row>
          <mdb-row>
            <span class="ml-0 my-2 mx-auto fl_statHeading">Current Call Statistics</span>
          </mdb-row>
          <mdb-row class="my-2">
            <mdb-col col="md-4">
              <div class="fl_statName">Call State</div>
              <div class="fl_statTimer">TALKING</div>
            </mdb-col>
            <mdb-col col="md-4">
              <div class="fl_statName">In-State Time</div>
              <div class="fl_statTimer">00:00:30</div>
            </mdb-col>
            <mdb-col col="md-4">
              <div class="fl_statName">Talk Time</div>
              <div class="fl_statTimer">00:00:30</div>
            </mdb-col>
            <mdb-col col="md-4">
              <div class="fl_statName">Hold Time</div>
              <div class="fl_statTimer">00:00:30</div>
            </mdb-col>
            <mdb-col col="md-4">
              <div class="fl_statName">Hold Count</div>
              <div class="fl_statTimer">1</div>
            </mdb-col>
          </mdb-row>-->
          <span class="row mb-0 my-2 no-gutters text-justify fl_statHeading">
            <span>Session Statistics</span>
          </span>

          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">Time since Login</dd>
            <dd class="col">00:38:45</dd>
          </dl>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">Total Time On Calls</dd>
            <dd class="col">00:14:44</dd>
          </dl>

          <span class="row mb-0 my-2 no-gutters text-justify fl_statHeading">
            <span>Agent Statistics</span>
          </span>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">Agent State</dd>
            <dd class="col">{{currentAgentState}}</dd>
          </dl>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">In-State Time</dd>
            <dd class="col">00:01:35</dd>
          </dl>

          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">Aux Time</dd>
            <dd class="col">00:00:00</dd>
          </dl>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">ACW Time</dd>
            <dd class="col">00:00:00</dd>
          </dl>

          <span class="row mb-0 my-2 no-gutters text-justify fl_statHeading">
            <span>Current Call Statistics</span>
          </span>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">Call State</dd>
            <dd class="col">TALKING</dd>
          </dl>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">In-State Time</dd>
            <dd class="col">
              <timer name="callStateTimer"></timer>
            </dd>
          </dl>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">Talk Time</dd>
            <dd class="col">00:01:05</dd>
          </dl>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">Hold Time</dd>
            <dd class="col">00:00:30</dd>
          </dl>
          <dl class="row mb-0 no-gutters text-justify">
            <dd class="col">Hold Count</dd>
            <dd class="col">1</dd>
          </dl>
        </mdb-container>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import {AGENT_STATES} from '@/defines'
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbIcon
} from 'mdbvue'

import LoginTimer from '@/components/widgets/AgentCallStatistics/LoginTimer.vue'
import Timer from '@/components/util/Timer.vue'
export default {
  name: 'AgentCallStats',
  components: {
    Timer,
    LoginTimer,
    mdbRow,
    mdbCol,
    mdbContainer,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbIcon
  },
  props: {},
  data() {
    return {
      showWidget: true
    }
  },
  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    }
  },
  computed: {
    uuiLabels() {
      return this.$store.state.uui.labels
    },
    callerData() {
      return this.$store.state.callerData
    },
    uuiElements() {
      return this.$store.state.uui
    },
    currentAgentState(){
      return AGENT_STATES.Text[this.$store.getters.getAgentState]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fl_statHeading {
  font-size: 1em;
  font-weight: bold;
  margin-left: auto !important;
}
.fl_statTimer {
  font-size: 1.1em;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;

  padding-top: 3px;
  padding-bottom: 10px;
  text-align: center;
}
.fl_statName {
  color: rgba(0, 0, 0, 0.45);
  font-weight: bold;
  text-align: center;
}
</style>
