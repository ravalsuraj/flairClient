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

        //Called after Call transfer socket request is successful
        processCallTransferDone({ commit }) {
            commit('RESET_CALL_MODULE')
            commit('RESET_CONSULTED_CALL_MODULE')
        },

        processCallConferenceDone({ commit }) {

        },

        //Called upon Socket event: OUTCALLRING
        // setConsultedCallStateRinging({ commit, dispatch }, payload) {
        //     dispatch('setCallState', [payload.callId, CALL_STATES.RINGING])
        // },

        //Called when transfer request is successful (From processTransferDone)
        // setConsultedCallStateTalking({ commit, dispatch }, payload) {
        //     dispatch('setCallState', [payload.callId, CALL_STATES.TALKING])
        //     commit('SET_ACTIVE_CALL', [payload.ucid, payload.callId])
        // },

        // setConsultedCallStateHeld({ commit, dispatch }, payload) {
        //     dispatch('setCallState', [payload.callId, CALL_STATES.HELD])
        //     commit('RESET_ACTIVE_CALL', [payload.ucid, payload.callId])
        // },



        requestConsultCall({ getters, commit, dispatch }, ucid) {
            return new Promise((resolve, reject) => {
                try {

                    let request = {
                        sessionId: getters['session/getSessionId'],
                        primaryUcid: ucid,
                        dialedNumber: getters.getDialedDigits,
                    }


                    console.log("requestConsultCall(): request=" + JSON.stringify(request));
                    this._vm.$socket.emit(
                        SOCKET_EVENTS.CONSULT_CALL,
                        request,
                        resp => {
                            console.log("requestConsultCall(): resp=" + JSON.stringify(resp));
                            if (resp.responseCode == '0') {
                                // commit('SET_CONF_STATE_CONSULTED', resp)
                                // dispatch('processNewConsultedCall', resp)
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

        requestConferenceCall({ getters, dispatch }, payload) {

            let request = {
                sessionId: getters['session/getSessionId'],
                primaryUcid: payload.ucidA,
                consultedUcid: payload.ucidB
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

        requestTransferCall({ getters, dispatch }, payload) {

            let request = {
                sessionId: getters['session/getSessionId'],
                primaryUcid: payload.ucidA,
                consultedUcid: payload.ucidB
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

    }
}

