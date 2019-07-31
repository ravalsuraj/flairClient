import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import Cookies from 'js-cookie'

import agent from './modules/agent'
import call from './modules/call'
import session from './modules/session'
import socket from './modules/socket'
import timer from './modules/timer'
import data from './modules/data'

import {
  AGENT_STATES,
  CALL_STATES,
  CONNECTION_STATES,
  TIMER_STATES
} from '@/defines.js'


const vuexPersist = new VuexPersist({
  key: 'flair',
  storage: sessionStorage,
  modules: ['agent', 'call', 'socket', 'timer', 'data', 'session'],
 
})

// const vuexCookie = new VuexPersist({
//   restoreState: (key, storage) => Cookies.getJSON(key),
//   saveState: (key, state, storage) =>
//     Cookies.set(key, state, {
//       expires: 1
//     }),
//   modules: ['session']
// })

Vue.use(Vuex)
export default new Vuex.Store({
  strict: false, //important: this is set to false to comply with Vuex-persist
  modules: {
    agent,
    call,
    session,
    socket,
    timer,
    data
  },
  plugins: [vuexPersist.plugin],

  state: {

    timer: {
      demo: 0,
      callStateTimer: 0
    },

    confStarted: false,
    devMode: false,
    socket: {

    },

    sockets: {
      connect() { },
      connection_error() {
        this.state.socket.status = CONNECTION_STATES.DISCONNECTED
      }
    },
  },
  actions: {
    showErrorBanner(context, [title, message]) {
      Vue.notify({
        group: 'error',
        title: title,
        text: message,
        duration: 3000
      })
    }

  },
  /*******************************************************************
   * Mutations
   ******************************************************************/

  mutations: {

    TOGGLE_DEV_MODE(state) {
      state.devMode = !state.devMode
    },

  },
  getters: {
    socketRequest() {
      return {
        sessionId: '',
        deviceId: '',
        agentId: '',
        agentState: '',
        remoteId: '',
        ucid: '',
        callId: '',
        uui: '',
        password: '',
        workMode: 'auto',
        consultedUcid: '',
        consultedCallId: ''
      }

    },
  }

})
