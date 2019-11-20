import { CALL_STATES, CALL_TYPES, SOCKET_EVENTS, AGENT_STATES } from '@/defines.js'
function initialState() {
    return {
        calls: [],
        callIndices: [],
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
    getCalls(state) {
        return state.calls
    },
    getCallByUcid: (state) => (ucid) => {
        return state.calls[state.callIndices.indexOf(ucid)]
    },

    getCallByIndex: (state) => (index) => {
        return state.calls[index]
    },

    getCallIndex: (state) => (ucid) => {
        console.log("getCallIndex():ucid=" + ucid + ", callindices=" + JSON.stringify(state.callIndices))
        console.log("getCallIndex(): returning index=" + state.callIndices.indexOf(ucid))
        return state.callIndices.indexOf(ucid)
    }

}

const actions = {
    addCallToActiveCalls({ commit, getters }, call) {
        let existingCall = getters.getCallByUcid(call.ucid);
        console.log("addCallToActiveCalls(): existingCall=" + JSON.stringify(existingCall))
        if (!existingCall) {
            let newCall = call;
            newCall.status = CALL_STATES.CREATED
            commit('ADD_CALL', newCall)
        } else {
            console.log("addCallToActiveCalls(): skipping ADD_CALL mutation since the call already exists")
        }

    },

    removeCallFromActiveCalls({ commit }, ucid) {
        commit('REMOVE_CALL', ucid)
    },
    setCallState({ commit, getters }, [ucid, newStatus]) {

        console.log("setCallState(): ucid=" + ucid)
        let index = getters.getCallIndex(ucid);
        console.log("setCallState(): index=" + index)
        commit('SET_CALL_STATE', [index, newStatus])
    },
    setCallStateRinging({ commit, dispatch, getters }, payload) {
        dispatch('addCallToActiveCalls', payload)
        commit('SET_CALL_STATE_RINGING', payload)
        commit('SET_CALL_ARR_STATE_RINGING', getters.getCallIndex(payload.ucid))
        let uui = {
            cli: payload.callingAddress,
            ucid: payload.ucid
        }
        dispatch('setUui', uui)
        dispatch('setCallerData', uui)
    },

    setCallStateDialing({ commit, dispatch, getters }, payload) {
        commit('SET_CALL_STATE_DIALING', payload)
        commit('SET_CALL_ARR_STATE_DIALING', getters.getCallIndex(payload.ucid))

        let uui = {
            cli: payload.callingAddress,
            ucid: payload.ucid
        }
        dispatch('setUui', uui)
        dispatch('setCallerData', uui)
    },

    setCallStateTalking({ commit, getters }, payload) {
        commit('SET_CALL_STATE_TALKING', payload)
        commit('SET_CALL_ARR_STATE_TALKING', getters.getCallIndex(payload.ucid))
    },
    setCallStateHeld({ commit, getters }, payload) {
        commit('SET_CALL_STATE_HELD', payload)
        commit('SET_CALL_ARR_STATE_HELD', getters.getCallIndex(payload.ucid))
    },

    setCallStateDropped({ commit, dispatch, getters }, payload) {
        commit('SET_CALL_STATE_DROPPED', payload)
        commit('SET_CALL_ARR_STATE_DROPPED', getters.getCallIndex(payload.ucid))
        dispatch('setAgentAuxCode', {
            label: 'After Call Work',
            state: AGENT_STATES.WORK_NOT_READY,
            userSelectable: true,
            reasonCode: 3
        })
        dispatch('removeCallFromActiveCalls', payload.ucid)
    },

    resetCallState({ commit }) {
        commit('RESET_CALL_STATUS')
        commit('RESET_CRM_DATA')
    },

    requestAnswerDropCall({ getters, dispatch }, [requestedUcid]) {
        let request = {
            sessionId: getters['session/getSessionId'],
            ucid: requestedUcid
        }
        console.log("requestAnswerDropCall(): request=", request)
        let callStatus = getters.getCallByUcid(requestedUcid).status
        // callStatus = getters.getCallStatus
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
                dispatch('showErrorBanner', ['Cannot Disconnect', 'Please remove the call from hold, before attempting to disconnect'])
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
        let callStatus = getters.getCallByUcid(requestedUcid).status;

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

    ADD_CALL(state, call) {
        state.calls.push(call)
        state.callIndices.push(call.ucid)
    },

    SET_CALL_STATE(state, [index, newStatus]) {

        state.calls[index].status = newStatus
    },

    SET_CALL_STATE_RINGING(state, payload) {

        state.primary.status = CALL_STATES.RINGING
        state.primary.ucid = payload.ucid
        state.primary.callId = payload.callId
        state.primary.calledAddress = payload.calledAddress
        state.primary.callingAddress = payload.callingAddress
    },

    SET_CALL_STATE_DIALING(state, payload) {
        state.primary.status = CALL_STATES.DIALING
        state.primary.ucid = payload.ucid
        state.primary.callId = payload.callId
        state.primary.calledAddress = payload.calledAddress
        state.primary.callingAddress = payload.callingAddress
    },

    SET_CALL_STATE_TALKING(state, payload) {
        state.primary.status = CALL_STATES.TALKING
    },
    SET_CALL_STATE_HELD(state, payload) {
        state.primary.status = CALL_STATES.HELD
    },
    SET_CALL_STATE_DROPPED(state, payload) {
        state.primary.status = CALL_STATES.DROPPED
    },

    SET_CALL_ARR_STATE_RINGING(state, index) {
        state.calls[index].status = CALL_STATES.RINGING
    },

    SET_CALL_ARR_STATE_DIALING(state, index) {
        state.calls[index].status = CALL_STATES.DIALING
    },

    SET_CALL_ARR_STATE_TALKING(state, index) {
        state.calls[index].status = CALL_STATES.TALKING
    },
    SET_CALL_ARR_STATE_HELD(state, index) {
        state.calls[index].status = CALL_STATES.HELD
    },
    SET_CALL_ARR_STATE_DROPPED(state, index) {
        state.calls[index].status = CALL_STATES.DROPPED
    },

    REMOVE_CALL(state, index) {
        delete state.callIndices[index]
        delete state.calls[index]
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

