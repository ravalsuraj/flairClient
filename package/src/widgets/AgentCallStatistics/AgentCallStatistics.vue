<template>
  <widget title="Statistics">
    <template v-slot:body>
      <mdb-container>
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
          <dd class="col">
            <agent-timer-instate></agent-timer-instate>
          </dd>
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
          <dd class="col">{{currentCallState}}</dd>
        </dl>
        <dl class="row mb-0 no-gutters text-justify">
          <dd class="col">In-State Time</dd>
          <dd class="col">
            <call-timer-instate></call-timer-instate>
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
    </template>
  </widget>
</template>

<script>
import { AGENT_STATES, CALL_STATES } from '@/defines'
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

import UpTimer from '@/components/agc/UpTimer.vue'
import CallTimerInstate from '@/widgets/AgentCallStatistics/CallTimerInstate.vue'
import AgentTimerInstate from '@/widgets/AgentCallStatistics/AgentTimerInstate.vue'
import Widget from '@/components/agc/Widget'

export default {
  name: 'AgentCallStats',
  components: {
    Widget,
    UpTimer,
    CallTimerInstate,
    AgentTimerInstate,
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
    return {}
  },
  methods: {},
  computed: {
    callerData() {
      return this.$store.state.callerData
    },

    currentAgentState() {
      return AGENT_STATES.Text[this.$store.getters.getAgentState]
    },
    currentCallState() {
      return CALL_STATES.Text[this.$store.getters.getCallStatus]
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
