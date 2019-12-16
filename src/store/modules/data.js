import api from "@/services/api.js";
import sugarconnector from "../../services/sugarconnector";
function initialState() {
  //hard-coded UUI for testing
  return {
    crm: {
      access_token: null,
      accountId: null,
      computedUrl: "http://13.235.180.13/sugarcrm/"
    },
    uui: [
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
        key: 'Credit Card.',
        value: ''
      },
      {
        key: 'Credit Card Type',
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
    },

    RESET_CRM_DATA(state) {
      state.crm.accountId = null,
        state.crm.computedUrl = "http://13.235.180.13/sugarcrm/"
    },

    SET_ACCESS_TOKEN(state, access_token) {
      state.crm.access_token = access_token
    },
    SET_CALLER_ACCOUNT_ID(state, accountId) {
      state.crm.accountId = accountId
    },
    SET_COMPUTED_URL(state, accountId) {
      state.crm.computedUrl = "http://13.235.180.13/sugarcrm/#Accounts/" + accountId
    },


    SET_UUI(state, payload) {
      state.uui[0].value = payload.cli
      state.uui[1].value = payload.ucid
      state.uui[3].value = "CreditCard"
    },

    SET_CALLER_DATA(state, payload) {
      state.callerData[0].value = "Suraj Raval"
      state.callerData[1].value = payload.cli
      state.callerData[2].value = "5412 1234 4321 8888"
      state.callerData[3].value = "Premium Rewards Plus"
    }

  },

  actions: {

    resetDummyData({ commit }) {
      commit('RESET_DATA_MODULE')
    },
    setUui({ commit }, payload) {

      commit('SET_UUI', payload)
    },

    setCallerData({ commit }, payload) {
      commit('SET_CALLER_DATA', payload)
    },
    requestSendSms({ }, payload) {
      api.sendSmsRequestToGateway(payload)
    },

    authenticateCrm({ commit, dispatch }) {
      return sugarconnector.fetchOuathTokenForSugarCrm().then(resp => {
        if (resp && resp.data && resp.data.access_token) {
          commit('SET_ACCESS_TOKEN', resp.data.access_token)
        } else {
          dispatch('showErrorBanner', ['CRM error...', 'Sugar CRM authentication failure. Cannot retreive CRM data for screenpop'])
        }
      })
    },

    getAccountIdFromCli({ getters, commit, dispatch }, phoneNumber) {
      new Promise((resolve, reject) => {

        let request = {
          header: {
            authToken: getters.getSugarAccessToken
          },
          body: {
            phoneNumber: phoneNumber
          }
        }
        sugarconnector.getAccountIdFromPhoneNumber(request).then(resp => {
          if (resp.data.records.length > 0) {
            commit('SET_CALLER_ACCOUNT_ID', resp.data.records[0].id)
            commit('SET_COMPUTED_URL', resp.data.records[0].id)
            resolve(resp)
          } else {
            dispatch('showErrorBanner', ['CRM Screenpop failed', 'We were unable to fetch a record for the number ' + phoneNumber])
            reject(resp)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }

  },
  getters: {
    getCallerData(state) {
      return state.callerData
    },
    getUui(state) {
      return state.uui
    },
    getSugarAccessToken(state) {
      return state.crm.access_token
    },
    getSugarAccountId(state) {
      return state.crm.accountId
    },
    getComputedCrmUrl(state) {
      return state.crm.computedUrl
    },
    getCrmUrl(state) {
      return "http://localhost:4000"
    }
  }
}
