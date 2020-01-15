<template>
  <form @submit.prevent class="form form-inline d-flex align-items-center">
    <mdb-dropdown class="mr-5">
      <!--Selected State-->
      <a class="dropdown-toggle-a primary-text" slot="toggle">
        <mdb-icon
          icon="circle"
          :class="agentStateIndicatorColor(currentAgentAuxState.state)"
          class="mr-1"
        />
        {{currentAgentAuxState.label}}
      </a>

      <mdb-dropdown-menu left>
        <!--List of all possible agent states-->
        <mdb-dropdown-item
          class="p-0 fl_dropdown_item"
          :key="auxCodesV2.id"
          v-for="(auxCode,i) in auxCodesV2"
        >
          <div
            @click="onAgentStateDropDownChanged(auxCode)"
            class="p-2"
            v-if="auxCode.userSelectable===true"
          >
            <!-- Round Icon to indicate the color of the agent's state-->
            <mdb-icon icon="circle" class="mr-1" :class="agentStateIndicatorColor(auxCode.state)" />
            <!-- Actual Agent State-->
            <span>{{auxCode.label}}</span>
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
import { config } from '@/config'
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
      auxCodes: config.agentAuxCodes,
      agentReasonCodeList: config.agentReasonCodeList,
      auxCodesV2: this.$store.getters.getFullAuxCodeList
    }
  },

  methods: {
    //This Method is called whenever the Agent Dropdown option is changed
    onAgentStateDropDownChanged(selectedAuxCode) {
      console.log(
        'onAgentStateDropDownChanged(): method entered. selectedAuxCode=' +
          JSON.stringify(selectedAuxCode)
      )
      //Depending on the selected state, update the store with the new state
      switch (selectedAuxCode.state) {
        case AGENT_STATES.READY:
        case AGENT_STATES.NOT_READY:
          this.$store
            .dispatch('sendAgentStateRequest', selectedAuxCode)
            .then(resp => {
              if (resp.responseCode === '0') {
                this.$store.commit('SET_AGENT_AUX_CODE', selectedAuxCode)
              }
            })
          break

        default:
      }
    },
    agentStateIndicatorColor(state) {
      if (state) {
        //console.log('agentStateIndicatorColor(): state=', state)
        switch (state) {
          case AGENT_STATES.READY:
            return 'green-text'

          case AGENT_STATES.NOT_READY:
            return 'red-text'
          case AGENT_STATES.BUSY:
            return 'amber-text'
          case AGENT_STATES.WORK_NOT_READY:
          case AGENT_STATES.LOG_IN:
            return 'blue-text'
        }
      }
    }
  },
  computed: {
    currentAgentAuxState() {
      return this.$store.getters.getAgentAuxState
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