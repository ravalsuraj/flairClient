import { CALL_STATES, CALL_TYPES, SOCKET_EVENTS } from '@/defines.js'
function initialState() {
    return {

        primary: {
            ucid: '0',
            callId: '',
            status: CALL_STATES.IDLE,
            calledAddress: '',
            callingAddress: ''
        },

    }
}
const state = initialState()

const getters = {
    getCallStatus(state) {
        return state.primary.status
    },

    getPrimaryCall(state) {
        return state.primary
    },

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



    requestAnswerDropCall({ getters, dispatch }, [requestedUcid, callType]) {
        let request = {
            sessionId: getters['session/getSessionId'],
            ucid: requestedUcid
        }
        console.log("requestAnswerDropCall(): request=", request)
        let callStatus;
        if (callType === CALL_TYPES.PRIMARY) {
            callStatus = getters.getCallStatus
        }
        else {
            callStatus = getters.getConsultedCallStatus
        }
        switch (callStatus) {
            case CALL_STATES.RINGING:
                console.log('AnswerDropCall(): calling answerCall()')
                dispatch('requestAnswerCall', request)
                break
            case CALL_STATES.TALKING:
                console.log('AnswerDropCall(): calling dropCall()')
                dispatch('requestDropCall', request)

                break
            default:
                console.log('AnswerDropCall(): skipping answer or drop because call state is: ' + CALL_STATES.Text[callStatus])
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
           // dispatch('setCallStateTalking')
        } else {
            dispatch('showErrorBanner', ['Call Answer Failed', response.responseMessage])
        }
    },

    processDropCallResponse({ dispatch }, response) {
        console.log('processDropCallResponse(): response=' + JSON.stringify(response))
        if (response.responseCode === '0') {
            //dispatch('setCallStateDropped')
        } else {
            dispatch('showErrorBanner', ['Call Drop Failed', response.responseMessage])
        }
    },

    requestHoldUnholdCall({ getters, dispatch }, [requestedUcid, callType]) {
        console.log("requestHoldUnholdCall(): action entered")

        let request = {
            sessionId: getters['session/getSessionId'],
            agentId: getters['getAgentCredentials'].agentId,
            deviceId: getters['getAgentCredentials'].deviceId,
            ucid: requestedUcid,
        }
        console.log("requestHoldUnholdCall(): request=", request)
        let callStatus;
        if (callType === CALL_TYPES.PRIMARY) {
            callStatus = getters.getCallStatus
        }
        else {
            callStatus = getters.getConsultedCallStatus
        }
        switch (callStatus) {
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
               // dispatch('setCallStateHeld')
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
                //dispatch('setCallStateTalking')
            } else {
                console.log('Call Unhold Failed' + JSON.stringify(response))
            }
        })
    },

}

const mutations = {

    RESET_CALL_MODULE(state) {
        Object.assign(state, initialState())
    },

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

}

export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions
}

