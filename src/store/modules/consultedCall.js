import { CALL_STATES, SOCKET_EVENTS } from '@/defines.js'
function initialState() {
    return {
        consultedCall: {
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

        getConsultedCallStatus(state) {
            return state.consultedCall.status
        },

        getConsultedCall(state) {
            return state.consultedCall
        }
    },

    actions: {

        processCallTransferDone({ commit }) {
            commit('RESET_CALL_MODULE')
            commit('RESET_CONSULTED_CALL_MODULE')
        },

        processCallConferenceDone({ commit }) {

        },

        setConsultedCallStateRinging({ commit }, payload) {
            commit('SET_CONF_STATE_RINGING')
        },
        setConsultedCallStateTalking({ commit }, payload) {
            commit('SET_CONF_STATE_TALKING')
        },
        setConsultedCallStateHeld({ commit }, payload) {
            commit('SET_CONF_STATE_HELD')
        },
        setConsultedCallStateDropped({ commit }, payload) {
            commit('SET_CONF_STATE_DROPPED')
            commit('RESET_CONSULTED_CALL_MODULE')
        },

        requestConsultCall({ getters, commit }) {

            let request = {
                sessionId: getters['session/getSessionId'],
                ucid: getters.getPrimaryCall.ucid,
                dialedNumber: getters.getDialedDigits,
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

        requestConferenceCall({ getters, dispatch }) {

            let request = {
                sessionId: getters['session/getSessionId'],
                primaryUcid: getters.getPrimaryCall.ucid,
                consultedUcid: getters.getConsultedCall.ucid
            }

            console.log("requestConferenceCall(): request=" + JSON.stringify(request));
            this._vm.$socket.emit(
                SOCKET_EVENTS.CONFERENCE_CALL,
                request,
                resp => {
                    console.log("requestConferenceCall(): resp=" + JSON.stringify(resp));
                    if (resp.responseCode === '0') {
                        dispatch('processCallConferenceDone', resp)
                    }
                }
            )
        },

        requestTransferCall({ getters, dispatch }) {

            let request = {
                sessionId: getters['session/getSessionId'],
                primaryUcid: getters.getPrimaryCall.ucid,
                consultedUcid: getters.getConsultedCall.ucid
            }

            console.log("requestTransferCall(): request=" + JSON.stringify(request));
            this._vm.$socket.emit(
                SOCKET_EVENTS.TRANSFER_CALL,
                request,
                resp => {
                    console.log("requestTransferCall(): resp=" + JSON.stringify(resp));
                    if (resp.responseCode === '0') {
                        dispatch('processCallTransferDone', resp)
                    }
                }
            )
        },

    },

    mutations: {

        RESET_CONSULTED_CALL_MODULE(state) {
            Object.assign(state, initialState())
        },
        
        SET_CONF_STATE_CONSULTED(state, payload) {
            state.consultedCall.callId = payload.callId
            state.consultedCall.ucid = payload.ucid
            state.consultedCall.status = CALL_STATES.CREATED
            state.consultedCall.calledAddress = payload.calledAddress
            state.consultedCall.callingAddress = payload.callingAddress
        },



        SET_CONF_MODE_INITIATED(state) {
            state.call.confereceMode = true
        },

        SET_CONF_STATE_RINGING(state, payload) {
            state.consultedCall.status = CALL_STATES.RINGING
        },

        SET_CONF_STATE_TALKING(state, payload) {
            state.consultedCall.status = CALL_STATES.TALKING
            //    state.call.primary.status = CALL_STATES.HELD
        },

        SET_CONF_STATE_HELD(state, payload) {
            state.consultedCall.status = CALL_STATES.HELD
            //    state.call.primary.status = CALL_STATES.HELD
        },

        SET_CONF_STATE_DROPPED(state, payload) {
            state.consultedCall.status = CALL_STATES.IDLE
            state.consultedCall.calledAddress = ''
            state.consultedCall.callingAddress = ''
            state.consultedCall.ucid = ''
            state.consultedCall.callId = ''
        },
    }
}

