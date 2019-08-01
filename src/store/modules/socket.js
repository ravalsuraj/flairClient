import {
    AGENT_STATES,
    CALL_STATES,
    CONNECTION_STATES,
    TIMER_STATES
} from '@/defines.js'

function initialState() {
    return {
        status: CONNECTION_STATES.DISCONNECTED
    }
}
const state = initialState
const mutations = {
    /******************* SOCKETIO STATE MUTATIONS *********************/
    SET_SOCKET_STATE_CONNECTED(state) {
        state.status = CONNECTION_STATES.CONNECTED
    },
    SET_SOCKET_STATE_DISCONNECTED(state) {
        state.status = CONNECTION_STATES.DISCONNECTED
    }
}
const actions = {

    setSocketStateConnected({ commit }, context) {
        commit('SET_SOCKET_STATE_CONNECTED')
    },

    setSocketStateDisconnected({ commit }, context) {
        commit('SET_SOCKET_STATE_DISCONNECTED')
    },

    processSocketConnected({ dispatch }) {
        dispatch('setSocketStateConnected')
        dispatch('queryAgentLogin', { root: true })
        dispatch('session/fetchExistingSessionFromServer', { root: true })
        
    },

    /**********************************
    *  INCOMING SOCKET REQUESTS
    **********************************/

    SOCKET_ICALLRING({ dispatch }, payload) {
        console.log('Recieved event:' + 'ICALLRING' + JSON.stringify(payload))
        dispatch('setCallStateRinging', payload)
    },

    SOCKET_ICALLTALK({ dispatch }, payload) {
        console.log('Received event: ' + 'ICALLANS: ' + JSON.stringify(payload))
        dispatch('setCallStateTalking', payload)
    },

    SOCKET_ICALLDISC({ dispatch, getters }, payload) {
        console.log('payload call iD is ' + payload.callId)
        console.log('callId for primary call is: ' + getters.getPrimaryCall.callId)
        console.log('callId for conf call is: ' + getters.getConferenceCall.callId)
        console.log(payload)
        console.log('Received event: ' + 'ICALLDISC' + JSON.stringify(payload))

        if (getters.getPrimaryCall.callId == payload.callId) {
            console.log('ICALLDISC is called for primary call')
            dispatch('setCallStateDropped', payload)
        } else if (getters.getConferenceCall.callId == payload.callId) {
            console.log('ICALLDISC is called for conference call')
            dispatch('setConferenceCallStateDropped', payload)
        } else {
            console.log('ICALLDISC not identified for call OR conf call')
        }
    },

    SOCKET_ICALLHLD({ dispatch }, payload) {
        console.log('Recieved event:' + 'ICALLHLD' + JSON.stringify(payload))
        dispatch('setCallStateHeld', payload)
    },

    SOCKET_CONCALLRING({ dispatch, commit }, payload) {
        console.log('Received event: ' + 'CONCALLRING' + JSON.stringify(payload))

        commit('setConferenceCallStateRinging', payload)
    },

    SOCKET_CONCALLTALK({ dispatch }, payload) {
        console.log('Received event: ' + 'CONCALLTALK' + JSON.stringify(payload))

        dispatch('setConferenceCallStateTalking', payload)
    },

    SOCKET_CONCALLDISC({ dispatch }, payload) {
        console.log('Received event: ' + 'CONCALLDISC' + JSON.stringify(payload))
        dispatch('setConferenceCallStateDropped', payload)
    },

    SOCKET_CONCALLHLD({ dispatch }, payload) {
        console.log('Received event: ' + 'CONCALLHOLD' + JSON.stringify(payload))
        dispatch('setConferenceCallStateHeld', payload)
    },

}
const getters = {}

export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions
}


