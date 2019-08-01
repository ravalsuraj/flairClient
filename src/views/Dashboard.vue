<template>
  <mdb-container fluid class="mx-2 px-0">
    <mdb-row class="mx-0">
      <!-- <mdb-col lg="2p5" md="12" class="px-0">
        <draggable
          :list="leftComponents"
          class="dragArea"
          :options="{ghostClass:'ghost-component', chosenClass: 'chosen-component', 
          animation:150, dragClass:'dragged-component',
           filter: '.card-body', preventOnFilter: false}"
        >
          <transition-group name>
            <component
              v-for="component in leftComponents"
              :is="component.name"
              :key="component.name"
              class="fl_widget"
            >
   
            </component>
          </transition-group>
        </draggable>
      </mdb-col>-->

      <mdb-col lg="10" md="12" class="mb-1 px-0 mx-0">
        <div class="w-100 h-100" color="primary">
          <!--     
          <mdb-input type="text" v-model="custName"></mdb-input>
          -->
          <crm-frame class style></crm-frame>
        </div>
      </mdb-col>

      <mdb-col lg="2" md="12" class="mb-1 px-0 mx-0">
        <draggable
          :list="rightComponents"
          class="dragArea"
          :options="{ghostClass:'ghost-component', chosenClass: 'chosen-component', 
          animation:150, dragClass:'dragged-component',
           filter: '.card-body', preventOnFilter: false}"
        >
          <transition-group name>
            <component
              v-for="component in rightComponents"
              :is="component.name"
              :key="component.name"
              class="fl_widget"
            ></component>
          </transition-group>
        </draggable>
      </mdb-col>
    </mdb-row>
  </mdb-container>
</template>

<script>
import draggable from 'vuedraggable'
import { config } from '@/config.js'
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbIcon,
  mdbTbl,
  mdbInput
} from 'mdbvue'
import CallHistory from '@/components/widgets/CallHistory/CallHistory.vue'
import CallDetails from '@/components/widgets/CallDetails/CallDetails.vue'
import MenuTraversal from '@/components/widgets/MenuTraversal/MenuTraversal.vue'
import CallControl from '@/components/widgets/CallControl/CallControl.vue'
import AgentControl from '@/components/widgets/AgentControl/AgentControl.vue'
import AgentCallStatistics from '@/components/widgets/AgentCallStatistics/AgentCallStatistics.vue'
import TestBench from '@/components/widgets/TestBench.vue'
import TimerTest from '@/components/widgets/TimerTest.vue'
import Dialer from '@/components/widgets/Dialer/Dialer.vue'
import CallDisposition from '@/components/widgets/CallDisposition/CallDisposition.vue'
import CrmFrame from '@/components/widgets/CrmFrame/CrmFrame.vue'
import QuickLinks from '@/components/widgets/QuickLinks/QuickLinks.vue'
import SmsHelper from '@/components/widgets/SmsHelper/SmsHelper.vue'

export default {
  name: 'Dashboard',
  components: {
    TimerTest,
    draggable,
    Dialer,
    CrmFrame,
    QuickLinks,
    CallDisposition,
    AgentCallStatistics,
    MenuTraversal,
    CallControl,
    TestBench,
    AgentControl,
    CallDetails,
    CallHistory,
    SmsHelper,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbIcon,
    mdbTbl,
    mdbInput
  },
  data() {
    return {
      custName: ''
    }
  },
  mounted() {
    //this.preventRefresh();
  },
  methods: {
    preventRefresh() {
      window.addEventListener('beforeunload', function(e) {
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = ''
      })
    }
  },
  computed: {
    myGhost() {
      return { 'my-ghost': true }
    },
    leftComponents: {
      get() {
        return config.leftComponents
      },
      set(value) {
        this.$store.commit('updateLeftComponents', value)
      }
    },
    rightComponents: {
      get() {
        return config.rightComponents
      },
      set(value) {
        this.$store.commit('updateRightComponents', value)
      }
    },
    isDevMode() {
      return this.$store.state.devMode
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.ghost-component {
  opacity: 0;
  cursor: move;
}
/* .chosen-component {
} */

.dragged-component {
  opacity: 1 !important;
}
</style>
