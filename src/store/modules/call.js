import { CALL_STATES, SOCKET_EVENTS } from '@/defines.js'
function initialState() {
    return {

        primary: {
            ucid: '0',
            callId: '',
            status: CALL_STATES.IDLE,
            calledAddress: '',
            callingAddress: ''
        },
        conference: {
            ucid: '0',
            callId: '',
            status: CALL_STATES.IDLE,
            calledAddress: '',
            callingAddress: ''
        },

        dialer: {
            dialerDigits: null
        }

    }
}
const state = initialState()

const getters = {
    getCallStatus(state) {
        return state.primary.status
    },

    getConferenceCallStatus(state) {
        return state.conference.status
    },

    getPrimaryCall(state) {
        return state.primary
    },
    getConferenceCall(state) {
        return state.conference
    }
}

const actions = {
    setCallStateRinging({ commit }, payload) {
        commit('SET_CALL_STATE_RINGING', payload)

        // state.uui[1].value = payload.callingAddress
        // state.uui[2].value = '20180202181123454'
        // state.uui[3].value = payload.callingAddress
        // state.uui[4].value = 'Accounts'

        // state.callerData[0].value = 'Suraj Raval'
        // state.callerData[1].value = payload.callingAddress
        // state.callerData[2].value = '00100295902701'
        // state.callerData[3].value = 'Imperial'
    },

    setCallStateTalking({ commit }) {
        commit('SET_CALL_STATE_TALKING')
    },

    setCallStateDropped({ commit }, payload) {
        commit('RESET_CALL_STATUS')
        // state.uui.CLI = ''

        // state.uui[0].value = ''
        // state.uui[1].value = ''
        // state.uui[2].value = ''
        // state.uui[3].value = ''
        // state.callerData[0].value = ''
        // state.callerData[1].value = ''
        // state.callerData[2].value = ''
        // state.callerData[3].value = ''

        // for (let i = 0; i < state.uui.length; ++i) {
        //     state.uui[i].value = ''
        // }
    },

    setCallStateHeld({ commit }) {
        commit('SET_CALL_STATE_HELD')
    },
    callConsulted(state, payload) {
        state.socketRequest.consultedUcid = payload.ucid
        state.socketRequest.consultedCallId = payload.callId

        state.conference.callId = payload.callId
        state.conference.ucid = payload.ucid
        state.conference.status = CALL_STATES.CREATED
        state.conference.calledAddress = payload.calledAddress
        state.conference.callingAddress = payload.callingAddress
    },

    callTransfered(state, payload) {
        state.primary.status = CALL_STATES.IDLE
        state.primary.calledAddress = ''
        state.primary.callingAddress = ''
        state.primary.ucid = ''
        state.primary.callId = ''

        state.conference.status = CALL_STATES.IDLE
        state.conference.calledAddress = ''
        state.conference.callingAddress = ''
        state.conference.ucid = ''
        state.conference.callId = ''

        state.socketRequest.ucid = ''
        state.socketRequest.callId = ''
    },

    setConferenceCallStateInitiated(state) {
        state.confereceMode = true
    },

    setConferenceCallStateRinging(state, payload) {
        state.conference.status = CALL_STATES.RINGING
    },

    setConferenceCallStateTalking(state, payload) {
        state.conference.status = CALL_STATES.TALKING
        state.primary.status = CALL_STATES.HELD
    },
    setConferenceCallStateDropped(state, payload) {
        state.conference.status = CALL_STATES.IDLE
        state.conference.calledAddress = ''
        state.conference.callingAddress = ''
        state.conference.ucid = ''
        state.conference.callId = ''
    },

    requestAnswerDropCall({ getters, dispatch }, callId) {
        let request = {
            sessionId: getters['session/getSessionId'],
            callId: callId
        }
        console.log("request=", request)

        switch (getters.getCallStatus) {
            case CALL_STATES.RINGING:
                console.log('AnswerDropCall: calling answerCall()')
                dispatch('requestAnswerCall', request)
                break
            case CALL_STATES.TALKING:
                console.log('AnswerDropCall: calling dropCall()')
                dispatch('requestDropCall', request)

                break
            default:
        }
    },
    requestAnswerCall({ getters, dispatch }, request) {
        console.log('requestAnswerCall(): action entered')

        if (!getters.devMode) {

            console.log('requestAnswerCall(): request=' + JSON.stringify(request))

            this._vm.$socket.emit(SOCKET_EVENTS.ANSWER_CALL, request, (response) => {
                dispatch("processAnswerCallResponse", response)
            })
        } else {
            dispatch('processAnswerCallResponse', { responseCode: '0', responseMessage: 'success' })
        }
    },


    requestDropCall({ getters, dispatch }, request) {

        if (!getters.isDevMode) {
            console.log(SOCKET_EVENTS.DROP_CALL + '(): request=' + JSON.stringify(request))
            this._vm.$socket.emit(SOCKET_EVENTS.DROP_CALL, request, response => {
                dispatch('processDropCallResponse', response)
            })
        } else {
            dispatch('processDropCallResponse', { responseCode: '0', responseMessage: 'success' })
        }
    },

    processAnswerCallResponse({ dispatch }, response) {
        console.log(SOCKET_EVENTS.ANSWER_CALL + '(): response=' + JSON.stringify(response))
        if (response.responseCode === '0') {
            dispatch('setCallStateTalking')
        } else {
            dispatch('showErrorBanner', ['Call Answer Failed', response.responseMessage])
        }
    },

    processDropCallResponse({ dispatch }, response) {
        console.log('processDropCallResponse(): response=' + JSON.stringify(response))
        if (response.responseCode === '0') {
            dispatch('setCallStateDropped')
        } else {
            dispatch('showErrorBanner', ['Call Drop Failed', response.responseMessage])
        }
    },

    requestHoldUnholdCall({ getters, dispatch }, callId) {
        console.log("requestHoldUnholdCall(): action entered")
        let request = {
            sessionId: getters['session/getSessionId'],
            agentId: getters['getAgentCredentials'].agentId,
            deviceId: getters['getAgentCredentials'].deviceId,
            callId: callId,
        }
        console.log("request=", request)

        // $socket is socket.io-client instance
        switch (getters.getCallStatus) {
            case CALL_STATES.HELD:
                dispatch('requestUnholdCall', request)
                break
            default:
                dispatch('requestHoldCall', request)
                break
        }
    },

    requestHoldCall({ dispatch }, request) {
        console.log('requestHoldCall():  request=' + JSON.stringify(request))

        this._vm.$socket.emit(SOCKET_EVENTS.HOLD_CALL, request, (response) => {
            console.log('requestHoldCall(): response=' + JSON.stringify(response))
            if (response.responseCode === '0') {
                dispatch('setCallStateHeld')
            } else {
                dispatch('showErrorBanner', ['Hold Call Failed', JSON.stringify(response)])
            }
        })
    },
    requestUnholdCall({ dispatch }, request) {
        console.log('requestUnholdCall():  request=' + JSON.stringify(request))

        this._vm.$socket.emit(SOCKET_EVENTS.RETRIEVE_CALL, request, (response) => {
            console.log('requestUnholdCall(): response=' + JSON.stringify(response))
            if (response.responseCode === '0') {
                dispatch('setCallStateTalking')
            } else {
                console.log('Call Unhold Failed' + JSON.stringify(response))
            }
        })
    },

    updateDialedDigits({ commit }, dialedDigits) {
        commit('UPDATE_DIALED_DIGITS', dialedDigits)
    }

}

const mutations = {
    SET_CALL_STATE_RINGING(state, payload) {
        state.primary.status = CALL_STATES.RINGING
        state.primary.ucid = payload.ucid
        state.primary.callId = payload.callId
        state.primary.calledAddress = payload.calledAddress
        state.primary.callingAddress = payload.callingAddress
    },
    SET_CALL_STATE_TALKING(state) {
        state.primary.status = CALL_STATES.TALKING
    },
    SET_CALL_STATE_HELD(state) {
        state.primary.status = CALL_STATES.HELD
    },

    RESET_CALL_STATUS(state) {
        const s = initialState()
        Object.keys(s).forEach(key => {
            state[key] = s[key]
        })
    },

    /***************Conference Call Mutations **************** */
    UPDATE_DIALED_DIGITS(state, dialedDigits) {
        state.dialer.dialedDigits = dialedDigits
    },

}

export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions
}

