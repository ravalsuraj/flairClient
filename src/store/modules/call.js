import { CALL_STATES, CALL_TYPES, SOCKET_EVENTS, AGENT_STATES } from '@/defines.js'
function initialState() {
    return {
        calls: [],
        activeCall: {
            ucid: ''
        },
        totalCallList: [],
        outboundCallList: [],
        consultedCallList: [],
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
    getConsultedCallList(state) {
        return state.consultedCallList
    },
    getActiveCall(state) {
        return state.activeCall.ucid
    },
    getCallByUcid: (state) => (ucid) => {
        return state.calls[state.totalCallList.indexOf(ucid)]
    },

    getCallByIndex: (state) => (index) => {
        return state.calls[index]
    },

    getCallIndex: (state) => (ucid) => {
        console.log("getCallIndex():ucid=" + ucid + ", totalCallList=" + JSON.stringify(state.totalCallList))
        console.log("getCallIndex(): returning index=" + state.totalCallList.indexOf(ucid))
        return state.totalCallList.indexOf(ucid)
    }

}

const actions = {
    addCallToActiveCalls({ commit, getters }, call) {
        let existingCall = getters.getCallByUcid(call.ucid);
        console.log("addCallToActiveCalls(): check if call exists. if existingcall is undefined, this call is a new call. existingCall=" + JSON.stringify(existingCall))
        if (!existingCall) {
            let newCall = call;
            newCall.status = CALL_STATES.CREATED
            newCall.type = CALL_TYPES.INBOUND
            //http://jsfiddle.net/pdmrL1gq/1/
            newCall.startTime = new Date().getTime()
            commit('ADD_CALL', newCall)
        } else {
            console.log("addCallToActiveCalls(): skipping ADD_CALL mutation since the call already exists")
        }

    },

    removeCallFromActiveCalls({ commit, getters }, ucid) {
        commit('REMOVE_CALL', getters.getCallIndex(ucid))
        commit('REMOVE_CALL_FROM_OUTBOUND_CALL_LIST', ucid)
        commit('REMOVE_CALL_FROM_CONSULTED_CALL_LIST', ucid)

    },
    setCallState({ commit, getters }, [ucid, newStatus]) {

        console.log("setCallState(): ucid=" + ucid + ", newStatus=" + newStatus)
        let index = getters.getCallIndex(ucid);
        console.log("setCallState(): index=" + index)
        commit('SET_CALL_STATE', [index, newStatus])
    },

    setCallStateRinging({ commit, dispatch, getters }, payload) {
        dispatch('addCallToActiveCalls', payload)
        // commit('SET_CALL_STATE_RINGING', payload)
        commit('SET_CALL_ARR_STATE_RINGING', getters.getCallIndex(payload.ucid))
        let uui = {
            cli: payload.callingAddress,
            ucid: payload.ucid
        }
        dispatch('setUui', uui)
        dispatch('setCallerData', uui)
    },

    setCallStateDialing({ commit, dispatch, getters }, payload) {
        // commit('SET_CALL_STATE_DIALING', payload)
        // commit('SET_CALL_ARR_STATE_DIALING', getters.getCallIndex(payload.ucid))

        let uui = {
            cli: payload.callingAddress,
            ucid: payload.ucid
        }
        dispatch('setUui', uui)
        dispatch('setCallerData', uui)
    },

    setCallStateTalking({ commit, getters }, payload) {
        // commit('SET_CALL_STATE_TALKING', payload)
        commit('SET_CALL_ARR_STATE_TALKING', getters.getCallIndex(payload.ucid))
        commit('SET_ACTIVE_CALL', payload.ucid)
    },
    setCallStateHeld({ commit, getters }, payload) {
        // commit('SET_CALL_STATE_HELD', payload)
        commit('SET_CALL_ARR_STATE_HELD', getters.getCallIndex(payload.ucid))
        commit('RESET_ACTIVE_CALL', payload.ucid)
    },

    setCallStateDropped({ commit, dispatch, getters }, payload) {
        // commit('SET_CALL_STATE_DROPPED', payload)
        commit('SET_CALL_ARR_STATE_DROPPED', getters.getCallIndex(payload.ucid))
        if (payload.ucid === getters.getActiveCall.ucid) {
            commit('RESET_ACTIVE_CALL', payload.ucid)
        }
        // dispatch('setAgentAuxCode', {
        //     label: 'After Call Work',
        //     state: AGENT_STATES.WORK_NOT_READY,
        //     userSelectable: true,
        //     reasonCode: 3
        // })
        dispatch('removeCallFromActiveCalls', payload.ucid)
    },

    addConsultedCall({ commit, getters }, payload) {
        let index = getters.getCallIndex(payload.ucid)
        commit('ADD_CALL_TO_CONSULTED_CALL_LIST', payload.ucid)
        commit('SET_CALL_TYPE_CONSULTED', index)
    },
    removeConultedCall() {
        commit('REMOVE_CALL_FROM_CONSULTED_CALL_LIST', payload.ucid)
    },
    setCallStateOutbound({ commit, getters }, payload) {
        let index = getters.getCallIndex(payload.ucid)
        commit('ADD_CALL_TO_OUTBOUND_CALL_LIST', payload.ucid)
        commit('SET_CALL_TYPE_OUTBOUND', index)
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

    requestHoldUnholdCall({ getters, dispatch }, requestedUcid) {
        console.log("requestHoldUnholdCall(): action entered" + getters['getActiveCall'])

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
                let currentActiveUcid = getters['getActiveCall']
                console.log("" + currentActiveUcid)
                if (currentActiveUcid) {
                    dispatch('requestHoldCall', currentActiveUcid).then(() => {
                        dispatch('requestUnholdCall', request)
                    })
                } else {
                    console.log("else " + currentActiveUcid)
                    dispatch('requestUnholdCall', request)
                }


                break
            default:
                dispatch('requestHoldCall', request)
                break
        }
    },

    requestHoldCall({ dispatch }, request) {
        return new Promise((resolve, reject) => {
            console.log('requestHoldCall():  request=' + JSON.stringify(request))



            this._vm.$socket.emit(SOCKET_EVENTS.HOLD_CALL, request, (response) => {
                console.log('requestHoldCall(): response=' + JSON.stringify(response))
                if (response.responseCode === '0') {
                    resolve(response)
                } else {
                    dispatch('showErrorBanner', ['Hold Call Failed', JSON.stringify(response)])
                    reject(response)
                }
            })
        }).catch((err) => {
            console.error('requestHoldCall(): ', err)
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
        state.totalCallList.push(call.ucid)
    },

    SET_CALL_STATE(state, [index, newStatus]) {

        state.calls[index].status = newStatus
    },

    SET_ACTIVE_CALL(state, ucid) {
        state.activeCall.ucid = ucid
    },
    RESET_ACTIVE_CALL(state, ucid) {
        if (state.activeCall.ucid === ucid) {
            state.activeCall.ucid = null
        }
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

    SET_CALL_TYPE_CONSULTED(state, index) {
        state.calls[index].type = CALL_TYPES.CONSULTED
    },

    SET_CALL_TYPE_OUTBOUND(state, index) {
        state.calls[index].type = CALL_TYPES.OUTBOUND
    },

    ADD_CALL_TO_CONSULTED_CALL_LIST(state, ucid) {
        //Check if the consulted call list has the ucid. If not, push it
        if (!state.consultedCallList.includes(ucid)) {
            state.consultedCallList.push(ucid)
        }
    },

    REMOVE_CALL_FROM_CONSULTED_CALL_LIST(state, ucid) {
        if (state.consultedCallList.includes(ucid)) {
            state.consultedCallList.splice(ucid)
        }
    },
    ADD_CALL_TO_OUTBOUND_CALL_LIST(state, ucid) {
        //Check if the consulted call list has the ucid. If not, push it
        if (!state.outboundCallList.includes(ucid)) {
            state.outboundCallList.push(ucid)
        }
    },
    REMOVE_CALL_FROM_OUTBOUND_CALL_LIST(state, ucid) {
        //Check if the consulted call list has the ucid. If not, push it
        if (state.outboundCallList.includes(ucid)) {
            state.outboundCallList.splice(ucid)
        }
    },


    REMOVE_CALL(state, index) {
        state.totalCallList.splice(index)
        state.calls.splice(index)
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

