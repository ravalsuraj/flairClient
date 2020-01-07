import { CALL_STATES, CALL_TYPES, SOCKET_EVENTS, TIMER_TYPES } from '@/defines.js'
import Utils from '@/services/Utils';
import { MULTI_CALL_STATES } from '../../defines';
function initialState() {
    return {
        calls: [],
        activeCall: {
            ucid: ''
        },
        totalCallList: [],
        inboundCallList: [],
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
    getInboundCallList(state) {
        return state.inboundCallList
    },
    getActiveCallUcid(state) {
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
    },
    getMultiCallState: (state) => (ucid) => {
        console.log("getMultiCallState called. call[x]=", state.calls[state.totalCallList.indexOf(ucid)])
        return state.calls[state.totalCallList.indexOf(ucid)].multiCallState
    }

}

const actions = {
    addCallToActiveCalls({ commit, getters, dispatch }, call) {
        return new Promise((resolve) => {
            let existingCall = getters.getCallByUcid(call.ucid);

            //check if call exists. if existingcall is undefined, this call is a new call, so add it
            console.log("addCallToActiveCalls(): existingCall=" + JSON.stringify(existingCall))
            if (!existingCall) {

                dispatch('addCallTimers', call.ucid)
                let newCall = call;
                newCall.multiCallState = MULTI_CALL_STATES.SINGLE
                newCall.status = CALL_STATES.CREATED
                newCall.type = CALL_TYPES.INBOUND
                //http://jsfiddle.net/pdmrL1gq/1/
                newCall.startTime = new Date().getTime()
                commit('ADD_CALL', newCall)
                resolve()
            } else {
                console.log("addCallToActiveCalls(): skipping ADD_CALL mutation since the call already exists")
                resolve()
            }

        })

    },

    removeCallFromActiveCalls({ commit, getters, dispatch }, ucid) {
        commit('RESET_ACTIVE_CALL', ucid)
        commit('REMOVE_CALL_FROM_OUTBOUND_CALL_LIST', ucid)
        commit('REMOVE_CALL_FROM_CONSULTED_CALL_LIST', ucid)
        commit('REMOVE_CALL_FROM_INBOUND_CALL_LIST', ucid)
        commit('REMOVE_CALL', getters.getCallIndex(ucid))
        dispatch('removeTimer', Utils.getTimerName(ucid, TIMER_TYPES.CALL_TIMER))
        dispatch('removeTimer', Utils.getTimerName(ucid, TIMER_TYPES.IN_STATE_TIMER))

    },
    setCallState({ commit, getters }, [ucid, newStatus]) {

        console.log("setCallState(): ucid=" + ucid + ", newStatus=" + newStatus)
        let index = getters.getCallIndex(ucid);
        console.log("setCallState(): index=" + index)
        commit('SET_CALL_STATE', [index, newStatus])
    },

    addCallTimers({ dispatch }, ucid) {

        //Create the timer for the call, and then start the timer
        dispatch('addUpTimer', Utils.getTimerName(ucid, TIMER_TYPES.CALL_TIMER))
        dispatch('addUpTimer', Utils.getTimerName(ucid, TIMER_TYPES.IN_STATE_TIMER))

        dispatch('startTimer', Utils.getTimerName(ucid, TIMER_TYPES.CALL_TIMER))
        dispatch('startTimer', Utils.getTimerName(ucid, TIMER_TYPES.IN_STATE_TIMER))
    },

    setCallStateRinging({ commit, dispatch, getters }, payload) {

        // commit('SET_CALL_STATE_RINGING', payload)
        commit('SET_CALL_STATE_RINGING', getters.getCallIndex(payload.ucid))
        let uui = {
            cli: payload.callingAddress,
            ucid: payload.ucid
        }

    },

    setCallStateDialing({ commit, dispatch, getters }, payload) {

        let uui = {
            cli: payload.callingAddress,
            ucid: payload.ucid
        }
        dispatch('setUui', uui)
        dispatch('setCallerData', uui)
    },

    setCallStateTalking({ commit, getters }, payload) {

        commit('SET_CALL_STATE_TALKING', getters.getCallIndex(payload.ucid))
        commit('SET_ACTIVE_CALL', payload.ucid)
    },
    setCallStateHeld({ commit, getters }, payload) {

        commit('SET_CALL_STATE_HELD', getters.getCallIndex(payload.ucid))
        commit('RESET_ACTIVE_CALL', payload.ucid)
    },

    setCallStateDropped({ commit, dispatch, getters }, payload) {

        commit('SET_CALL_STATE_DROPPED', getters.getCallIndex(payload.ucid))
        if (payload.ucid === getters.getActiveCallUcid) {
            commit('RESET_ACTIVE_CALL', payload.ucid)
        }

        dispatch('removeCallFromActiveCalls', payload.ucid)
    },

    //Called when the first call event arrives (call state ringing)
    async processNewInboundCall({ commit, getters, dispatch }, payload) {

        await dispatch('addCallToActiveCalls', payload)

        dispatch('setCallStateRinging', payload)
        commit('ADD_CALL_TO_INBOUND_CALL_LIST', payload.ucid)
        let index = getters.getCallIndex(payload.ucid)
        commit('SET_CALL_TYPE_INBOUND', index)
    },

    //Called when the consult call request is made
    processNewConsultedCall({ commit, getters, dispatch }, payload) {

        dispatch('addCallToActiveCalls', payload)
        dispatch('addConsultedCallDetailsToPrimary', payload)
        dispatch('setConsultedCallStateTalking', payload)

        commit('ADD_CALL_TO_CONSULTED_CALL_LIST', payload.ucid)
        let index = getters.getCallIndex(payload.ucid)
        commit('SET_CALL_TYPE_CONSULTED', index)
    },

    //Called when the outbound call request is made
    processNewOutboundCall({ commit, getters, dispatch }, payload) {
        let index = getters.getCallIndex(payload.ucid)
        commit('ADD_CALL_TO_OUTBOUND_CALL_LIST', payload.ucid)
        commit('SET_CALL_TYPE_OUTBOUND', index)
    },

    processConferenceConnectionDisconnect({ commit, getters, dispatch }, payload){
        
        dispatch('removeConferenceCallFromPrimary', payload)
    },

    resetCallState({ commit }) {
        commit('RESET_CALL_STATUS')
        commit('RESET_CRM_DATA')
    },

    addConsultedCallDetailsToPrimary({ commit, getters }, payload) {
        let inboundCallList = getters.getInboundCallList
        if (inboundCallList && inboundCallList.length === 1) {
            let callIndex = getters.getCallIndex(inboundCallList[0])
            commit('ADD_CONSULTED_CALL_TO_PRIMARY', [callIndex, payload])

        }
    },

    removeConferenceCallFromPrimary({ commit, getters }, payload) {
        let inboundCallList = getters.getInboundCallList
        if (inboundCallList && inboundCallList.length === 1) {
            let callIndex = getters.getCallIndex(inboundCallList[0])
            if (payload.callingAddress === getters.getCallByIndex(callIndex).callingAddress){
                commit('SWITCH_PRIMARY_CONSULTED_CALL_ADDRESS', [callIndex])
            }
                commit('REMOVE_CONSULTED_CALL_FROM_PRIMARY', [callIndex])  

        }
    },
    setMultiCallStateConferenced({ commit, getters }, payload) {
        console.log("setMultiCallStateConferenced(): action entered: payload" + JSON.stringify(payload))
        let callIndex = getters.getCallIndex(payload.ucid)
        if (callIndex !== null) {
            console.log("setMultiCallStateConferenced(): commiting mutation. callIndex=" + callIndex)
            commit('SET_MULTI_CALL_STATE_CONFERENCED', callIndex)
            commit('DUMMY_MUTATION')
        } else {
            console.log("setMultiCallStateConferenced(): skiping mutation. callIndex=" + callIndex)
        }
    },

    requestAnswerDropCall({ getters, dispatch }, [requestedUcid, callType]) {
        let request = {
            sessionId: getters['session/getSessionId'],
            ucid: requestedUcid
        }
        console.log("requestAnswerDropCall(): request=", request)
        if (callType === CALL_TYPES.INBOUND) {
            let callStatus = getters.getCallByUcid(requestedUcid).status
    
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
        } else if (callType === CALL_TYPES.OUTBOUND) {
            dispatch('requestDropCall', request)
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
        } else {
            dispatch('showErrorBanner', ['Call Drop Failed', response.responseMessage])
        }
    },

    requestHoldUnholdCall({ getters, dispatch }, requestedUcid) {
        console.log("requestHoldUnholdCall(): action entered" + getters['getActiveCallUcid'])


        let callStatus = getters.getCallByUcid(requestedUcid).status;
        let primaryRequest = {
            sessionId: getters['session/getSessionId'],
            agentId: getters['getAgentCredentials'].agentId,
            deviceId: getters['getAgentCredentials'].deviceId,
            ucid: requestedUcid,
        }
        console.log("requestHoldUnholdCall(): primaryRequest=", primaryRequest)
        switch (callStatus) {
            case CALL_STATES.HELD:
                let currentActiveCallUcid = getters['getActiveCallUcid']

                if (currentActiveCallUcid) {
                    let holdActiveCallRequest = {
                        sessionId: getters['session/getSessionId'],
                        agentId: getters['getAgentCredentials'].agentId,
                        deviceId: getters['getAgentCredentials'].deviceId,
                        ucid: currentActiveCallUcid,
                    }

                    console.log("requestHoldUnholdCall(): holdActiveCallRequest=", primaryRequest)
                    dispatch('requestHoldCall', holdActiveCallRequest).then(() => {
                        dispatch('requestUnholdCall', primaryRequest)
                    })
                } else {
                    console.log("requestHoldUnholdCall(): no active calls, so sending unhold request " + currentActiveCallUcid)
                    dispatch('requestUnholdCall', primaryRequest)
                }


                break
            default:
                dispatch('requestHoldCall', primaryRequest)
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
    DUMMY_MUTATION(state) {

    },
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

    SET_CALL_STATE_RINGING(state, index) {
        state.calls[index].status = CALL_STATES.RINGING
        // state.calls[index].multiCallState = MULTI_CALL_STATES.SINGLE
    },

    SET_CALL_STATE_DIALING(state, index) {
        state.calls[index].status = CALL_STATES.DIALING
    },

    SET_CALL_STATE_TALKING(state, index) {
        state.calls[index].status = CALL_STATES.TALKING
    },
    SET_CALL_STATE_HELD(state, index) {
        state.calls[index].status = CALL_STATES.HELD
    },
    SET_CALL_STATE_DROPPED(state, index) {
        if (index != null && index != -1 && state.calls[index]) {
            state.calls[index].status = CALL_STATES.DROPPED
        }

    },

    SET_CALL_TYPE_INBOUND(state, index) {
        state.calls[index].type = CALL_TYPES.INBOUND
    },

    SET_CALL_TYPE_CONSULTED(state, index) {
        state.calls[index].type = CALL_TYPES.CONSULTED
    },
    SET_MULTI_CALL_STATE_CONFERENCED(state, index) {
        state.calls[index].multiCallState = MULTI_CALL_STATES.CONFERENCED
    },

    SET_CALL_TYPE_OUTBOUND(state, index) {
        state.calls[index].type = CALL_TYPES.OUTBOUND
    },
    ADD_CONSULTED_CALL_TO_PRIMARY(state, [index, payload]) {
        state.calls[index].multiCallState = MULTI_CALL_STATES.CONSULTED
        state.calls[index].consultedCall = payload
    },
    REMOVE_CONSULTED_CALL_FROM_PRIMARY(state, index) {
        state.calls[index].multiCallState = MULTI_CALL_STATES.SINGLE
        delete state.calls[index].consultedCall
    },

    SWITCH_PRIMARY_CONSULTED_CALL_ADDRESS(state, index){
        state.calls[index].callingAddress = state.calls[index].consultedCall.calledAddress
    },
    ADD_CALL_TO_INBOUND_CALL_LIST(state, ucid) {
        //Check if the inbound call list has the ucid. If not, push it
        if (!state.inboundCallList.includes(ucid)) {
            state.inboundCallList.push(ucid)
        } else {
            console.log("ADD_CALL_TO_INBOUND_CALL_LIST(): ucid does not exist in outboundCallList")
        }
    },
    REMOVE_CALL_FROM_INBOUND_CALL_LIST(state, ucid) {
        let index = state.inboundCallList.indexOf(ucid)
        if (index != -1) {

            state.inboundCallList.splice(index, 1)
        } else {
            console.log("REMOVE_CALL_FROM_INBOUND_CALL_LIST(): ucid does not exist in inboundCallList")
        }
    },

    ADD_CALL_TO_CONSULTED_CALL_LIST(state, ucid) {
        //Check if the consulted call list has the ucid. If not, push it
        if (!state.consultedCallList.includes(ucid)) {
            state.consultedCallList.push(ucid)
        }
    },

    REMOVE_CALL_FROM_CONSULTED_CALL_LIST(state, ucid) {
        let index = state.consultedCallList.indexOf(ucid);
        if (index != -1) {
            state.consultedCallList.splice(index, 1)
        } else {
            console.log("REMOVE_CALL_FROM_CONSULTED_CALL_LIST(): ucid does not exist in consultedCallList")
        }
    },
    ADD_CALL_TO_OUTBOUND_CALL_LIST(state, ucid) {
        //Check if the consulted call list has the ucid. If not, push it
        if (!state.outboundCallList.includes(ucid)) {
            state.outboundCallList.push(ucid)
        } else {
            console.log("ADD_CALL_TO_OUTBOUND_CALL_LIST(): ucid does not exist in outboundCallList")
        }
    },

    REMOVE_CALL_FROM_OUTBOUND_CALL_LIST(state, ucid) {
        //Check if the outbound call list has the ucid. If not, push it
        let index = state.outboundCallList.indexOf(ucid);
        if (index != -1) {
            state.outboundCallList.splice(index, 1)
        } else {
            console.log("REMOVE_CALL_FROM_OUTBOUND_CALL_LIST(): ucid does not exist in outboundCallList")
        }
    },


    REMOVE_CALL(state, index) {
        if (index != -1) {
            state.totalCallList.splice(index, 1)
            state.calls.splice(index, 1)
        }

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

