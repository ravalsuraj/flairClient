<template>
  <form @submit.prevent class="form form-inline d-flex align-items-center">
    <mdb-dropdown class="mr-5">
      <a class="dropdown-toggle-a primary-text" slot="toggle">
        <mdb-icon icon="circle" :class="agentStateIndicatorColor" class="mr-1" />
        {{activeAgentState}}
      </a>
      
      <mdb-dropdown-menu left>


        <mdb-dropdown-item class="p-0 fl_dropdown_item" v-if="activeReasonIndex!==0">
          <div @click="updateAgentState(0)" class="p-2">
            <mdb-icon icon="circle" class="green-text mr-1" />
            <span>Ready</span>
          </div>
        </mdb-dropdown-item>

        <!--List of all possible agent states-->
        <mdb-dropdown-item
          class="p-0 fl_dropdown_item"
          :key="reasonCode.id"
          v-for="(reasonCode,i) in reasonCodes"
          v-if="i>0&&activeReasonIndex<1"
        >
          <div @click="updateAgentState(i)" class="p-2">
            <!-- Round Icon to indicate the color of the agent's state-->
            <mdb-icon icon="circle" class="red-text mr-1" />
            <!-- Actual Agent State-->
            <span>{{reasonCode}}</span>
          </div>
        </mdb-dropdown-item>
      </mdb-dropdown-menu>
    </mdb-dropdown>
  </form>
</template>

<script>
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbBtn,
  mdbDropdown,
  mdbDropdownToggle,
  mdbDropdownItem,
  mdbDropdownMenu,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbIcon,
  mdbTbl
} from 'mdbvue'
import { AGENT_STATES } from '@/defines'
export default {
  name: 'AgentStateControl',
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
    mdbDropdown,
    mdbDropdownToggle,
    mdbDropdownItem,
    mdbDropdownMenu
  },
  props: {},
  data() {
    return {
      idleReason: '0',
      activeReasonIndex: -1,
      reasonCodes: ['Ready', 'Lunch', 'Tea', 'Bio-Break', 'End of Shift']
    }
  },
  methods: {
    //This Method is called whenever the Agent Dropdown option is changed
    updateAgentState(i) {
      //Set the selected state as active
      this.activeReasonIndex = i

      //Depending on the selected state, update the store with the new state
      switch (i) {
        case 0:
          this.$store.dispatch('sendAgentReadyRequest')
          break
        case -1:
          this.$store.commit('agentIdle')
          break
        default:
          this.$store.dispatch(
            'sendAgentNotReadyRequest',
            this.activeAgentState
          )
      }
    }
  },
  computed: {
    agentId() {
      return this.$store.getters.getAgent.id
    },
    agentState_btn_Label() {
      return this.$store.getters.getAgent.status === 'idle' ? 'Ready' : 'Break'
    },

    agentState_btn_Color() {
      return this.$store.getters.getAgent.status === 'idle'
        ? 'success'
        : 'danger'
    },

    agentState_isOnCall() {
      return this.$store.getters.getAgent.status === 'onCall'
    },
    agentState_isNotIdle() {
      return this.$store.getters.getAgent.status !== 'idle'
    },
    activeAgentState() {
      if (this.activeReasonIndex < 0) {
        return 'Idle'
      } else {
        return this.reasonCodes[this.activeReasonIndex]
      }
    },
    agentStateIndicatorColor() {
      if (this.activeReasonIndex < 0) {
        return 'grey-text'
      } else if (this.activeReasonIndex === 0) {
        return 'green-text'
      }
      return 'red-text'
    }
  }
}
</script>

<style scoped>
.fl_dropdown_item {
  font-size: 1rem !important;
}
.drop .dropdown-toggle-a {
  background-color: none;
}
.dropdown-toggle-a:after {
  display: inline-block;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: '';
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}
.custom-select {
  height: unset !important;
  line-height: 1;
}
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
