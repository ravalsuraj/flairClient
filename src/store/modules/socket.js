import {
    AGENT_STATES,
    CALL_STATES,
    SOCKET_STATES,
    TIMER_STATES
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

        setSocketStateConnected({ commit }, context) {
            commit('SET_SOCKET_STATE_CONNECTED')
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
            console.log('SOCKET_ICALLRING: ' + 'ICALLRING' + JSON.stringify(payload))
            dispatch('setCallStateRinging', payload)

            // if (getters.getPrimaryCall.ucid == payload.callId) {

            //     console.log('SOCKET_ICALLRING: called for primary call')
            //     dispatch('setCallStateRinging', payload)

            // } else if (getters.getConsultedCall.ucid == payload.callId) {

            //     console.log('SOCKET_ICALLRING: called for consultedCall call')
            //     dispatch('setConsultedCallStateRinging', payload)

            // } else {

            //     console.log('SOCKET_ICALLRING: not identified for call OR conf call')
            // }
        },

        SOCKET_ICALLTALK({ dispatch, getters }, payload) {
            console.log('Received event: ' + 'ICALLTALK: ' + JSON.stringify(payload))
            if (getters.getCallIndex(payload.ucid) !== null) {
                dispatch('setCallStateTalking', payload)
            }

            if (getters.getPrimaryCall.ucid == payload.ucid) {

                console.log('SOCKET_ICALLTALK: called for primary call')
                dispatch('setCallStateTalking', payload)

            } else if (getters.getConsultedCall.ucid == payload.ucid) {

                console.log('SOCKET_ICALLTALK: called for consultedCall call')
                dispatch('setConsultedCallStateTalking', payload)

            } else {

                console.log('SOCKET_ICALLTALK: not identified for call OR conf call')
            }
        },

        SOCKET_ICALLDISC({ dispatch, getters }, payload) {
            console.log('SOCKET_ICALLDISC(): Received event: ' + 'ICALLDISC' + JSON.stringify(payload))
            if (getters.getCallIndex(payload.ucid) !== null) {
                dispatch('setCallStateDropped', payload)
            } else {
                console.log("SOCKET_ICALLDISC(): no calls found for UCID:" + payload.ucid)
            }

            if (getters.getPrimaryCall.ucid == payload.ucid) {

                console.log('SOCKET_ICALLDISC(): called for primary call')
                dispatch('setCallStateDropped', payload)

            } else if (getters.getConsultedCall.ucid == payload.ucid) {

                console.log('SOCKET_ICALLDISC(): called for consultedCall call')
                dispatch('setConsultedCallStateDropped', payload)

            } else {
                console.log('SOCKET_ICALLDISC(): not identified for call OR conf call')
            }
        },

        SOCKET_ICALLHLD({ dispatch, getters }, payload) {
            console.log('Recieved event: ' + 'ICALLHLD' + JSON.stringify(payload))
            if (getters.getCallIndex(payload.ucid) !== null) {
                dispatch('setCallStateHeld', payload)
            }
            if (getters.getPrimaryCall.ucid == payload.ucid) {

                console.log('SOCKET_ICALLHLD: called for primary call')
                dispatch('setCallStateHeld', payload)

            } else if (getters.getConsultedCall.ucid == payload.ucid) {

                console.log('ISOCKET_ICALLHLD:  called for consultedCall call')
                dispatch('setConsultedCallStateHeld', payload)

            } else {

                console.log('ICALLHOLD not identified for call OR conf call')
            }


        },

        SOCKET_CONCALLRING({ dispatch }, payload) {
            console.log('Received event: ' + 'CONCALLRING' + JSON.stringify(payload))

            dispatch('setConsultedCallStateRinging', payload)
        },

        SOCKET_CONCALLTALK({ dispatch }, payload) {
            console.log('Received event: ' + 'CONCALLTALK' + JSON.stringify(payload))

            dispatch('setConsultedCallStateTalking', payload)
        },

        SOCKET_CONCALLDISC({ dispatch }, payload) {
            console.log('Received event: ' + 'CONCALLDISC' + JSON.stringify(payload))
            dispatch('setConsultedCallStateDropped', payload)
        },

        SOCKET_CONCALLHLD({ dispatch }, payload) {
            console.log('Received event: ' + 'CONCALLHOLD' + JSON.stringify(payload))
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
