import { CALL_STATES, SOCKET_EVENTS, CALL_TYPES } from '@/defines.js'
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
        checkCallTypePrimaryConsulted({ getters }, ucid) {

            if (ucid === getters.getPrimaryCall.ucid) {
                return CALL_TYPES.PRIMARY
            } else if (ucid === getters.getConsultedCall.ucid) {
                return CALL_TYPES.CONSULTED
            } else {
                return CALL_TYPES.UNKNOWN
            }
        },
        processCallTransferDone({ commit }) {
            commit('RESET_CALL_MODULE')
            commit('RESET_CONSULTED_CALL_MODULE')
        },

        processCallConferenceDone({ commit }) {

        },

        setConsultedCallStateRinging({ commit, dispatch }, payload) {
            dispatch('addCallToActiveCalls', payload)
            commit('SET_CONF_STATE_RINGING')
            dispatch('setCallState', [payload.ucid, CALL_STATES.RINGING])


        },
        setConsultedCallStateTalking({ commit, dispatch }, payload) {
            commit('SET_CONF_STATE_TALKING')
            dispatch('setCallState', [payload.ucid, CALL_STATES.TALKING])
        },
        setConsultedCallStateHeld({ commit, dispatch }, payload) {
            commit('SET_CONF_STATE_HELD')
            dispatch('setCallState', [payload.ucid, CALL_STATES.HELD])
        },
        setConsultedCallStateDropped({ commit, dispatch }, payload) {
            commit('SET_CONF_STATE_DROPPED')
            dispatch('setCallState', [payload.ucid, CALL_STATES.DROPPED])
            commit('RESET_CONSULTED_CALL_MODULE')
        },

        requestConsultCall({ getters, commit, dispatch }) {
            return new Promise((resolve, reject) => {
                try {


                    let request = {
                        sessionId: getters['session/getSessionId'],
                        primaryUcid: getters.getPrimaryCall.ucid,
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
                                dispatch('addCallToActiveCalls', resp)
                                resolve(resp)

                            } else {
                                resolve(resp)
                            }
                        }
                    )
                } catch (err) {
                    reject(err)
                }
            })

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

        },

        SET_CONF_STATE_HELD(state, payload) {
            state.consultedCall.status = CALL_STATES.HELD

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

