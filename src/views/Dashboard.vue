<template>
  <mdb-container fluid class="mx-2 px-0 pt-2">
    <mdb-row class="mb-4 mx-0">
      <mdb-col col="12">
        <call-drawer class="mx-3"></call-drawer>
      </mdb-col>
    </mdb-row>
    <hr />
    <mdb-row class="mx-0">
      <mdb-col :lg="leftComponentWidth" md="12" class>
        <draggable
          :list="leftComponentWidgets"
          class="dragArea"
          :options="{ghostClass:'ghost-component', chosenClass: 'chosen-component', 
          animation:150, dragClass:'dragged-component',
           filter: '.card-body', preventOnFilter: false}"
        >
          <transition-group name>
            <component
              v-for="component in leftComponentWidgets"
              :is="component.name"
              :key="component.name"
              class="fl_widget"
            ></component>
          </transition-group>
        </draggable>
      </mdb-col>

      <mdb-col :lg="middleComponentWidth" md="12" class="mb-1 px-0 mx-0">
        <draggable
          :list="middleComponentWidgets"
          class="dragArea"
          :options="{ghostClass:'ghost-component', chosenClass: 'chosen-component', 
          animation:150, dragClass:'dragged-component',
           filter: '.card-body', preventOnFilter: false}"
        >
          <transition-group name>
            <component
              v-for="component in middleComponentWidgets"
              :is="component.name"
              :key="component.name"
              class="fl_widget"
            ></component>
          </transition-group>
        </draggable>
      </mdb-col>

      <mdb-col :lg="rightComponentWidth" md="12" class="mb-1 px-0 mx-0">
        <draggable
          :list="rightComponentWidgets"
          class="dragArea"
          :options="{ghostClass:'ghost-component', chosenClass: 'chosen-component', 
          animation:150, dragClass:'dragged-component',
           filter: '.card-body', preventOnFilter: false}"
        >
          <transition-group name>
            <component
              v-for="component in rightComponentWidgets"
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
import CallHistory from '@/widgets/CallHistory/CallHistory.vue'
import CallDetails from '@/widgets/CallDetails/CallDetails.vue'
import MenuTraversal from '@/widgets/MenuTraversal/MenuTraversal.vue'

import AgentControl from '@/widgets/AgentControl/AgentControl.vue'
import AgentCallStatistics from '@/widgets/AgentCallStatistics/AgentCallStatistics.vue'
import TestBench from '@/widgets/TestBench.vue'
import ConsultDialer from '@/widgets/Dialer/ConsultDialer.vue'
import CallDisposition from '@/widgets/CallDisposition/CallDisposition.vue'
import CrmFrame from '@/widgets/CrmFrame/CrmFrame.vue'
import QuickLinks from '@/widgets/QuickLinks/QuickLinks.vue'
import SmsHelper from '@/widgets/SmsHelper/SmsHelper.vue'
import CallDrawer from '@/views/CallDrawer.vue'

export default {
  name: 'Dashboard',
  components: {
    draggable,
    ConsultDialer,
    CrmFrame,
    QuickLinks,
    CallDisposition,
    AgentCallStatistics,
    MenuTraversal,
    TestBench,
    AgentControl,
    CallDetails,
    CallHistory,
    SmsHelper,
    CallDrawer,

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
    config() {
      return this.$store.getters['session/getConfig']
    },
    myGhost() {
      return { 'my-ghost': true }
    },
    leftComponentWidgets: {
      get() {
        return this.config.leftComponents.widgets
      }
    },
    leftComponentWidth: {
      get() {
        return this.config.leftComponents.width
      }
    },
    middleComponentWidgets: {
      get() {
        return this.config.middleComponents.widgets
      }
    },
    middleComponentWidth: {
      get() {
        return this.config.middleComponents.width
      }
    },

    rightComponentWidgets: {
      get() {
        return this.config.rightComponents.widgets
      }
    },

    rightComponentWidth: {
      get() {
        return this.config.rightComponents.width
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
