<template>
  <widget title="AGS Helper">
    <template v-slot:body>
      <mdb-container fluid>
        <div v-if="dnis">
          <h3>LOB - {{lob}}</h3>
        </div>
        <div v-else>
          <h4 class="grey-text">Waiting for call</h4>
        </div>
      </mdb-container>
    </template>
  </widget>
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
import { AGENT_STATES, CALL_STATES, CALL_TYPES } from '@/defines.js'
import Widget from '@/components/agc/Widget'

export default {
  name: 'AgsHelper',
  components: {
    Widget,
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
      showWidget: false
    }
  },

  computed: {
    callId() {
      if (this.$store.getters.getActiveCallCallId) {
        return this.$store.getters.getActiveCallCallId
      } else {
        return this.$store.getters.getCallIdArray[0]
      }
      return
    },
    call() {
      if (this.$store.getters.getCallByCallId(this.callId)) {
        return this.$store.getters.getCallByCallId(this.callId)
      } else {
        return null
      }
    },
    dnis() {
      if (this.call) {
        if (this.call.callDirection === 1) {
          return this.call.calledAddress
        } else if (call.callDirection === 2) {
          return this.call.callingAddress
        }
      } else {
        return null
      }
    },
    lob() {
      if (this.callId && this.$store.getters.getLobForCallId(this.callId)) {
        return this.$store.getters.getLobForCallId(this.callId)
      } else {
        return null
      }
    }
  },

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    }
  },
  watch: {
    dnis(newDnis, oldDnis) {
      if (newDnis) {
        if (!this.lob) {
          console.log('AgsHelper/watch(dnis):')
          this.$store.dispatch('requestFetchLobFromDnis', {
            callId: this.callId,
            dnis: this.dnis
          })
        }
      }
    }
  }
}
</script>

