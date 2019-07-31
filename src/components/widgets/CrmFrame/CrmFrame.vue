<template>
  <mdb-container fluid class="px-0 mx-0" style="opacity: 1">
    <mdb-card class="mb-0">
      <mdb-card-header color="special-color">
        CRM ScreenPop
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <div>
        <mdb-card-body class="p-0 m-0" v-show-slide="showWidget" :class="{'p-0': !showWidget}">
          <iframe :src="crmUrl" class="w-100" style="border:none; height:550px;"></iframe>
        </mdb-card-body>
      </div>
    </mdb-card>
  </mdb-container>
</template>

<script>
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbIcon,
  mdbTbl,
  mdbTblHead,
  mdbTblBody,
  mdbListGroup,
  mdbListGroupItem,
  mdbBadge,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter
} from 'mdbvue'
import { CALL_STATES } from '@/defines'
import { config } from '@/config.js'
export default {
  name: 'CrmFrame',
  components: {
    mdbRow,
    mdbCol,
    mdbContainer,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbIcon,
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbListGroup,
    mdbListGroupItem,
    mdbBadge,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter
  },
  props: {},
  data() {
    return {
      manualShowWidget: true,
      callerName: 'John Doe',
      callerRMN: '+919876512345',
      callerAccountNo: '1234512345',
      callerTransferReason: 'TPIN Generate',
      callerLanguage: 'English'
    }
  },
  methods: {
    toggleShowWidget() {
      if (this.autoShowWidget === false) {
        this.manualShowWidget = !this.manualShowWidget
      }
    },

  },
  computed: {
    autoShowWidget() {
      return (
        this.$store.getters.getPrimaryCall.status === CALL_STATES.RINGING ||
        this.$store.getters.getPrimaryCall.status === CALL_STATES.TALKING
      )
    },
    showWidget() {
      return this.manualShowWidget || this.autoShowWidget
    },
    
    crmUrl() {
      return config.crmUrl
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
th,
td {
  font-size: 1rem;
}
</style>
