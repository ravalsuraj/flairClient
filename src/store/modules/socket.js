import {
    SOCKET_EVENTS,
    SOCKET_STATES,
} from '@/defines.js'

function initialState() {
    return {
        status: SOCKET_STATES.DISCONNECTED
    }
}
export default {
    state: initialState,
    mutations: {

        RESET_SOCKET_MODULE(state) {
            Object.assign(state, initialState())
        },

        /******************* SOCKETIO STATE MUTATIONS *********************/
        SET_SOCKET_STATE_CONNECTED(state) {
            state.status = SOCKET_STATES.CONNECTED

        },
        SET_SOCKET_STATE_DISCONNECTED(state) {
            state.status = SOCKET_STATES.DISCONNECTED
        }
    },
    actions: {

        setSocketStateConnected({ commit, dispatch }) {
            commit('SET_SOCKET_STATE_CONNECTED')
            dispatch('sendSessionRejoinEvent')

        },

        sendSessionRejoinEvent({ getters }) {
            let sessionId = getters['session/getSessionId']
            if (sessionId) {
                let request = {
                    sessionId: sessionId
                }
                this._vm.$socket.emit(SOCKET_EVENTS.REJOIN_SESSION, request, (response) => {
                    console.log('setSocketStateConnected(): response=' + JSON.stringify(response))
                })
            }
        },
        setSocketStateDisconnected({ commit }, context) {
            commit('SET_SOCKET_STATE_DISCONNECTED')
        },

        processSocketConnected({ getters, dispatch }) {
            dispatch('setSocketStateConnected')
            dispatch('session/fetchExistingSessionFromServer', { root: true }).then(resp => {
                console.log("processSocketConnected(): response received from fetchExistingSessionFromServer: resp=" + JSON.stringify(resp))
                console.log("responseCode " + (resp.responseCode === 0 ? "Not " : "is ") + "zero. sessionID not retreived. sessionId=" + getters['session/getSessionId'])
                if (resp.responseCode === "0" && (getters['session/getSessionId'].length)) {
                    console.log("processSocketConnected(): sending request for sendQueryAgentStateRequest")
                    dispatch('sendQueryAgentStateRequest', { root: true })
                } else {
                    console.log("processSocketConnected(): skipping request for sendQueryAgentStateRequest")
                }
            }).catch(() => {

                dispatch('processAgentLogout')

            })
        },

        /**********************************
        *  INCOMING SOCKET REQUESTS
        **********************************/
        SOCKET_DEVEVENT({ }, payload) {
            console.log('Recieved event: ' + 'DEVEVENT' + JSON.stringify(payload))
        },

        SOCKET_ICALLRING({ dispatch, getters }, payload) {
            console.log('SOCKET_ICALLRING: resp=' + JSON.stringify(payload))
            dispatch('processNewInboundCall', payload)


        },

        SOCKET_ICALLTALK({ dispatch, getters }, payload) {
            console.log('Received event: resp=' + JSON.stringify(payload))
            if (getters.getCallIndex(payload.ucid) !== null) {
                dispatch('setCallStateTalking', payload)
            }
            else {
                console.log('SOCKET_ICALLTALK: not identified for call OR conf call')
            }
        },

        SOCKET_ICALLDISC({ dispatch, getters }, payload) {
            console.log('SOCKET_ICALLDISC(): Received event: resp=' + JSON.stringify(payload))
            if (getters.getCallIndex(payload.ucid) !== null) {
                dispatch('setCallStateDropped', payload)
            } else {
                console.log("SOCKET_ICALLDISC(): no calls found for UCID:" + payload.ucid)
            }
        },

        SOCKET_ICALLHLD({ dispatch, getters }, payload) {
            console.log('SOCKET_ICALLHLD(): Recieved event: resp=' + JSON.stringify(payload))
            if (getters.getCallIndex(payload.ucid) !== null) {
                dispatch('setCallStateHeld', payload)
            }
            else {

                console.log('ICALLHOLD not identified for call OR conf call')
            }
        },

        SOCKET_CALLCONF({ dispatch, getters }, payload) {
            console.log('Recieved event: ' + 'CALLCONF' + JSON.stringify(payload))
            dispatch('setMultiCallStateConferenced', payload)
        },

        // SOCKET_OUTCALLRING({ dispatch }, payload) {
        //     console.log('Received event: ' + 'OUTCALLRING' + JSON.stringify(payload))

        //     dispatch('setConsultedCallStateRinging', payload)
        // },

        SOCKET_OUTCALLTALK({ dispatch }, payload) {
            console.log('Received event: ' + 'OUTCALLTALK' + JSON.stringify(payload))

            dispatch('processNewConsultedCall', payload)
        },

        SOCKET_OUTCALLDISC({ dispatch }, payload) {
            console.log('Received event: ' + 'OUTCALLDISC' + JSON.stringify(payload))
            dispatch('setCallStateDropped', payload)
        },

        SOCKET_OUTCALLHLD({ dispatch }, payload) {
            console.log('Received event: ' + 'OUTCALLHLD' + JSON.stringify(payload))
            dispatch('setConsultedCallStateHeld', payload)
        },
        SOCKET_AGTUPDATED({ dispatch }, payload) {
            console.log('Received event: ' + 'AGTUPDATED' + JSON.stringify(payload))
            dispatch('setAgentState', payload.agentState)
        }
    },
    getters: {
        getSocketStatus(state) {
            return state.status
        }
    }
}
