import { CALL_STATES, SOCKET_EVENTS } from '@/defines.js'
function initialState() {
    return {
        conference: {
            ucid: null,
            callId: null,
            status: CALL_STATES.IDLE,
            calledAddress: null,
            callingAddress: null
        }
    }
}
export default {

    state: initialState,

    getters: {

        getConferenceCallStatus(state) {
            return state.conference.status
        },

        getConferenceCall(state) {
            return state.conference
        }
    },

    actions: {

        requestConsultCall({ getters, commit }) {

            let request = {
                sessionId: getters['session/getSessionId'],
                ucid: getters.getPrimaryCall.ucid,
                remoteId: getters.getDialedDigits,
            }


            console.log("requestConsultCall(): request=" + JSON.stringify(request));
            this._vm.$socket.emit(
                SOCKET_EVENTS.CONSULT_CALL,
                request,
                resp => {
                    console.log("requestConsultCall(): resp=" + JSON.stringify(resp));
                    if (resp.responseCode === '0') {
                        commit('SET_CONF_STATE_CONSULTED', resp)

                    }
                }
            )
        },

        requestConferenceCall() {

            let request = {
                sessionId: getters['session/getSessionId'],
                remoteId: getters.getDialedDigits,
                ucid: getters.getPrimaryCall.ucid,
                consultedUcid: getters.getConferenceCall.ucid
            }

            console.log("requestConferenceCall(): request=" + JSON.stringify(request));
            this._vm.$socket.emit(
                SOCKET_EVENTS.CONFERENCE_CALL,
                request,
                resp => {
                    console.log("requestConferenceCall(): resp=" + JSON.stringify(resp));
                    if (resp.responseCode === '0') {
                        dispatch('SET_CONF_CALL_STATE_Initiated', resp)
                    }
                }
            )
        },

        requestTransferCall() {
            let request = {
                sessionId: getters['session/getSessionId'],
                ucid: getters.getPrimaryCall.ucid,
                consultedUcid: getters.getConferenceCall.ucid
            }

            console.log("requestTransferCall(): request=" + JSON.stringify(request));
            this._vm.$socket.emit(
                SOCKET_EVENTS.TRANSFER_CALL,
                request,
                resp => {
                    console.log("requestTransferCall(): resp=" + JSON.stringify(resp));
                    if (resp.responseCode === '0') {
                        dispatch('setCallStateTransferred', resp)
                    }
                }
            )
        },


        setConferenceCallStateRinging({ commit }, payload) {
            commit('SET_CONF_STATE_RINGING')
        },
        setConferenceCallStateTalking({ commit }, payload) {
            commit('SET_CONF_STATE_TALKING')
        },
        setConferenceCallStateHeld({ commit }, payload) {
            commit('SET_CONF_STATE_HELD')
        },
        setConferenceCallStateDropped({ commit }, payload) {
            commit('SET_CONF_STATE_DROPPED')
        }

    },

    mutations: {
        SET_CONF_STATE_CONSULTED(state, payload) {
            state.conference.callId = payload.callId
            state.conference.ucid = payload.ucid
            state.conference.status = CALL_STATES.CREATED
            state.conference.calledAddress = payload.calledAddress
            state.conference.callingAddress = payload.callingAddress
        },

        SET_CONF_STATE_TRANSFERRED(state, payload) {
            state.call.primary.status = CALL_STATES.IDLE
            state.call.primary.calledAddress = ''
            state.call.primary.callingAddress = ''
            state.call.primary.ucid = ''
            state.call.primary.callId = ''

            state.conference.status = CALL_STATES.IDLE
            state.conference.calledAddress = ''
            state.conference.callingAddress = ''
            state.conference.ucid = ''
            state.conference.callId = ''

            state.conference.socketRequest.ucid = ''
            state.conference.socketRequest.callId = ''
        },

        SET_CONF_MODE_INITIATED(state) {
            state.call.confereceMode = true
        },

        SET_CONF_STATE_RINGING(state, payload) {
            state.conference.status = CALL_STATES.RINGING
        },

        SET_CONF_STATE_TALKING(state, payload) {
            state.conference.status = CALL_STATES.TALKING
            //    state.call.primary.status = CALL_STATES.HELD
        },

        SET_CONF_STATE_HELD(state, payload) {
            state.conference.status = CALL_STATES.HELD
            //    state.call.primary.status = CALL_STATES.HELD
        },

        SET_CONF_STATE_DROPPED(state, payload) {
            state.conference.status = CALL_STATES.IDLE
            state.conference.calledAddress = ''
            state.conference.callingAddress = ''
            state.conference.ucid = ''
            state.conference.callId = ''
        },
    }
}

