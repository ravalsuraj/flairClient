import { AGENT_STATES, SOCKET_EVENTS } from '@/defines'
import { config } from '@/config'

function initialState() {
    return {
        agentState: AGENT_STATES.UNKNOWN,
        reasonCode: 0,
        reasonCodeLabel: '-',
        agentId: null,
        deviceId: null,
        password: null,
        workMode: null
    }
}

export default {
    namespaced: false,
    state: initialState,

    getters: {
        getAgent(state) {
            return state
        },

        getAgentState(state) {
            return state.agentState
        },

        getAgentAuxState(state) {
            return {
                state: state.agentState,
                reasonCode: state.reasonCode,
                label: state.reasonCodeLabel

            }
        },
        getAgentCredentials(state) {
            return {
                agentId: state.agentId,
                deviceId: state.deviceId,
                password: state.password
            }
        }
    },

    actions: {

        setAgentState({ commit }, agentState) {
            commit('SET_AGENT_STATE', agentState)
        },

        setAgentLoginCredentials({ commit }, credentials) {
            commit('SET_AGENT_LOGIN_CREDENTIALS', credentials)
        },

        setAgentAuxCode({ commit }, auxCodeObj) {
            commit('SET_AGENT_AUX_CODE', auxCodeObj)
        },
        async sendAgentLoginRequest({ commit, dispatch, getters }) {
            let agent = getters.getAgent;
            let sessionId = getters['session/getSessionId'];
            console.log("sendAgentLoginRequest(): sessionId=", sessionId)
            let request = {
                sessionId: sessionId,
                agentId: agent.agentId,
                deviceId: agent.deviceId,
                password: agent.password,
                workMode: agent.workMode
            }
            console.log('sendAgentLoginRequest(): request: ' + JSON.stringify(request))

            this._vm.$socket.emit(SOCKET_EVENTS.AGENT_LOGIN, request, (resp) => {

                console.log('sendAgentLoginRequest(): response: ' + JSON.stringify(resp))

                if (resp.responseCode === '0') {
                    dispatch('processAgentLogin')
                    return resp
                } else {
                    dispatch('showErrorBanner', ['Agent Login failed:', resp.responseMessage])
                }
                return resp
            }
            )
        },

        async sendAgentLogoutRequest({ commit, dispatch, getters }) {
            let agent = getters.getAgent;
            let sessionId = getters['session/getSessionId'];
            let request = {
                sessionId: sessionId,
                agentId: agent.agentId,
                deviceId: agent.deviceId,
                password: agent.password,
                workMode: agent.workMode
            }
            console.log('sendAgentLogoutEvent(): request: ' + JSON.stringify(request))

            this._vm.$socket.emit(SOCKET_EVENTS.AGENT_LOGOFF, request, (resp) => {

                console.log('sendAgentLogoutEvent(): response: ' + JSON.stringify(resp))

                if (resp.responseCode === '0') {
                    dispatch('processAgentLogout')
                    dispatch('session/resetSessionId')
                } else {
                    dispatch('showErrorBanner', ['Agent Logout failed:', resp.responseMessage])
                }
                return resp
            })
        },


        async sendAgentStateRequest({ getters, commit, dispatch }, auxRequest) {

            return new Promise((resolve, reject) => {
                let request = {
                    sessionId: getters['session/getSessionId'],
                    agentId: getters.getAgentCredentials.agentId,
                    deviceId: getters.getAgentCredentials.deviceId,
                    agentState: auxRequest.state,
                    reasonCode: auxRequest.reasonCode
                }

                console.log('sendAgentStateRequest(): request= ' + JSON.stringify(request))

                this._vm.$socket.emit('SETAGTSTATE', request, (resp) => {
                    console.log('sendAgentStateRequest(): response= ' + JSON.stringify(resp))
                    if (resp.responseCode === '0') {
                        commit('SET_AGENT_STATE', resp.agentState)

                        dispatch('setUpdatedAuxCode', resp)


                        resolve(resp)

                    } else {
                        reject(resp)
                    }

                })
            })
        },

        sendQueryAgentStateRequest({ getters, commit, dispatch }) {
            let agent = getters.getAgent;
            let sessionId = getters['session/getSessionId'];
            console.log("sendQueryAgentStateRequest(): sessionId=", sessionId)
            let request = {
                sessionId: sessionId,
                agentId: agent.agentId,
                deviceId: agent.deviceId
            }
            console.log('sendQueryAgentStateRequest(): request: ' + JSON.stringify(request))

            this._vm.$socket.emit(SOCKET_EVENTS.QUERY_AGENT_STATE, request, (resp) => {

                console.log('sendQueryAgentStateRequest(): response: ' + JSON.stringify(resp))

                if (resp.responseCode === '0') {

                    if (resp.agentState) {
                        commit('SET_AGENT_STATE', resp.agentState)
                        dispatch('setDefaultAuxCode', resp)
                    }

                    return resp
                } else {
                    if (resp.responseCode === "04" && resp.agentState === AGENT_STATES.LOG_OUT) {
                        commit('SET_AGENT_STATE', resp.agentState)
                    }
                    dispatch('showErrorBanner', ['Agent Login failed:', resp.responseMessage])
                }
                return resp
            }
            )
        },
        queryAgentState() {

        },

        processAgentLogin({ commit, dispatch }) {
            commit('SET_AGENT_STATE_LOGIN')
            dispatch('sendQueryAgentStateRequest')
        },
        processAgentLogout({ dispatch, commit }) {
            dispatch('resetAllModules')
            commit('SET_AGENT_STATE_LOGOUT')

        },
        /********************************* */
        setUpdatedAuxCode({ commit }, payload) {
            console.log("setUpdatedAuxCode(): payload=" + JSON.stringify(payload))
            let auxCodes = config.agentAuxCodes;

            let selectedAuxCode = {
                agentState: payload.agentState,
                reasonCode: payload.reasonCode,
                label: "Not Set"
            }
            if (payload.agentState === AGENT_STATES.READY) {
                selectedAuxCode.label = "Ready"
            } else {
                for (let i = 0; i < auxCodes.length; i++) {

                    if (auxCodes[i].reasonCode == payload.reasonCode) {
                        selectedAuxCode.label = auxCodes[i].label
                        console.log("setUpdatedAuxCode(): setting label= " + selectedAuxCode.label)

                    } else {
                        //console.log("aux code failed for i=" + i)
                    }
                }

            }
            console.log("setUpdatedAuxCode(): about to commit aux code. selectedAuxCode=", selectedAuxCode)
            commit('SET_AGENT_AUX_CODE', selectedAuxCode)
        },

        setDefaultAuxCode({ getters, commit }, payload) {

            console.log("getAgentAuxState is null, so setting default aux code for the state received from the login request")

            switch (payload.agentState) {
                case AGENT_STATES.READY:
                case AGENT_STATES.NOT_READY:

                    //for the text value, find the default aux code from the config file
                    let defaultAgentAuxCode = config.defaultAuxCodes[payload.agentState];
                    commit('SET_AGENT_AUX_CODE', defaultAgentAuxCode);
                    break;
            }

        },


    },



    mutations: {
        RESET_AGENT_MODULE(state) {
            Object.assign(state, initialState())
        },

        SET_AGENT_LOGIN_CREDENTIALS(state, credentials) {
            state.agentId = credentials.agentId
            state.deviceId = credentials.deviceId
            state.password = credentials.password
            state.workMode = credentials.workMode
        },

        SET_AGENT_STATE_LOGIN(state) {
            state.agentState = AGENT_STATES.LOG_IN
        },

        SET_AGENT_STATE_LOGOUT(state) {
            state.agentState = AGENT_STATES.LOG_OUT
        },

        SET_AGENT_STATE(state, agentState) {
            state.agentState = agentState
        },

        SET_AGENT_AUX_CODE(state, payload) {
            state.reasonCode = payload.reasonCode
            state.agentState = payload.state
            state.reasonCodeLabel = payload.label
        }
    }
}
