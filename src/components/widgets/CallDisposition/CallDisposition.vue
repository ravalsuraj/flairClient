<template>
  <mdb-container fluid>
    <mdb-card class="mb-0">
      <mdb-card-header color="special-color">
        Call Disposition
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <mdb-card-body class="px-1" v-show-slide="showWidget" :class="{'p-0': !showWidget}">
        <!-- <mdb-card-text><strong>Test Bench</strong></mdb-card-text> -->
        <mdb-container fluid>
          <label>Call Reason</label>
          <select class="browser-default custom-select mb-3">
            <option selected>Select Disposition Reason</option>
            <option value="1">Account Inquiry</option>
            <option value="2">Product Information</option>
            <option value="3">Technical Support</option>
          </select>
          <label class>Outcome</label>

          <select class="browser-default custom-select mb-4">
            <option selected>Select Outcome</option>
            <option value="1">Successful</option>
            <option value="2">Transfered to IVR</option>
            <option value="3">Disconnected</option>
          </select>
          <mdb-btn block color="mdb-color" @click="">Dispose</mdb-btn>
        </mdb-container>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
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
  name: 'CallDisposition',
  components: {
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
  props: {
    msg: String
  },

  data() {
    return {
      showWidget: true
    }
  },

  methods: {
    
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    },
  },
  
}
</script>

