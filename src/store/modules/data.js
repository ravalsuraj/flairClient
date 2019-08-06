import api from "@/services/api.js";
function initialState() {
  //hard-coded UUI for testing
  return {
    uui: [
      {
        key: 'Current Call Time',
        value: ''
      },
      {
        key: 'CLI',
        value: ''
      },
      {
        key: 'UCID',
        value: ''
      },
      {
        key: 'Collected Digits',
        value: '-'
      },
      {
        key: 'Split/Skill',
        value: ''
      }
    ],
    //hard-coded Caller Data for testing
    callerData: [
      {
        key: 'Name',
        value: ''
      },
      {
        key: 'RMN',
        value: ''
      },
      {
        key: 'Account No.',
        value: ''
      },
      {
        key: 'Account Type',
        value: ''
      }
    ]
  }

}

export default {
  state: initialState,
  mutations: {
    RESET_DATA_MODULE(state) {
      Object.assign(state, initialState())
    }
  },

  actions: {

    requestSendSms({ }, payload) {

      api.sendSmsRequestToGateway(payload)
    }
  },
  getters: {
    getCallerData(state) {
      return state.callerData
    },
    getUui(state) {
      return state.uui
    }
  }
}
