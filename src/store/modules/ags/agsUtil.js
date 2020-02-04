import agsMiddlewareConnector from '@/services/agsMiddlewareConnector.js'

import { CALL_STATES, SOCKET_EVENTS } from '@/defines.js'
import Utils from '../../../services/Utils'
function initialState() {
  return {
    lob_list: []
  }
}

export default {
  namespaced: false,
  state: initialState,
  getters: {
    getLobForCallId: state => callId => {
      let lob = Utils.getValueByKey(state.lob_list, 'callId', callId, 'lob')
      return lob
    }
  },
  mutations: {
    RESET_AGS_UTIL_MODULE(state) {
      Object.assign(state, initialState())
    },

    SET_LOB(state, [callId, lob]) {
      let tempLob = {
        callId: callId,
        lob: lob
      }
      state.lob_list.push(tempLob)
    }
  },
  actions: {
    async requestFetchLobFromDnis({ commit }, payload) {
      agsMiddlewareConnector.fetchLobFromDnis(payload).then(resp => {
        commit('SET_LOB', [payload.callId, resp.lob])
      })
    },

    async requestPostCallDisposition({ commit }, payload) {
      agsMiddlewareConnector.postCallDisposition(payload).then(resp => {
        return resp
      })
    }
  }
}
