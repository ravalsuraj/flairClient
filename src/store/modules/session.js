import {
    SOCKET_EVENTS
} from '@/defines.js'
import Utils from '@/services/Utils'
import { rejects } from 'assert';
function initialState() {
    return {
        ipAddress: '0.0.0.0',
        sessionId: null
    }
}

export default {
    namespaced: true,

    state: initialState,

    mutations: {
        RESET_SESSION_ID(state) {
            state.sessionId = null
        },
        SET_SESSION_ID(state, sessionId) {
            state.sessionId = sessionId
            //state.socketRequest.sessionId = payload.sessionId
            $cookies.set('sessionId', sessionId)
            console.log('Setting Session Id in Cookies: ' + JSON.stringify($cookies.get('sessionId')))
        },

        SET_IP_ADDRESS(state, ip) {
            state.ipAddress = ip
        },
    },
    actions: {

        async requestSessionFromServer({ getters, commit }) {
            console.log("requestSessionFromServer(): entered action")
            return new Promise((resolve) => {
                let request = {
                    ipAddress: getters.getIpAddress
                }
                console.log('requestSessionFromServer(): request=' + JSON.stringify(request))
                try {
                    this._vm.$socket.emit(SOCKET_EVENTS.GET_SESSION, request, resp => {
                        console.log('requestSessionFromServer():' + JSON.stringify(resp))
                        commit('SET_SESSION_ID', resp.sessionId)
                        resolve(resp);
                    })

                } catch (ex) {
                    reject(ex)
                }
            })

        },

        async updateIpAddress({ commit, dispatch, getters }) {
            //Call Utility function to retreive IP Address for this client
            Utils.getIpAddressForClient()
                .then(ip => {
                    console.log('updateIpAddress(): received IP:', ip)
                    commit('SET_IP_ADDRESS', ip)

                    if (getters['session/getSessionId'] === null) {
                        console.log('updateIpAddress(): Getting SessionId for IP Address:' + ip)
                        dispatch('session/requestSessionFromServer')
                    }
                })
                .catch(error => {
                    console.error('updateIpAddress(): error=' + error.message)
                })
        },

        async fetchExistingSessionFromServer({ getters, commit }) {
            console.log("fetchExistingSessionFromServer(): entered action")
            return new Promise((resolve) => {
                let sessionId = getters['getSessionId'];

                if (sessionId) {
                    let request = {
                        sessionId: sessionId
                    }
                    console.log('fetchExistingSessionFromServer(): request=' + JSON.stringify(request))

                    this._vm.$socket.emit(SOCKET_EVENTS.CHECK_SESSION, request, resp => {
                        console.log('fetchExistingSessionFromServer():' + JSON.stringify(resp))

                        if (resp && resp.sessionId) {
                            commit('SET_SESSION_ID', resp.sessionId)
                        } else {
                            console.log("fetchExistingSessionFromServer(): skipping update Session ID since the response does not contain a session ID. resp=", JSON.stringify(resp))
                        }

                        resolve(resp);
                    })
                } else {
                    console.log("fetchExistingSessionFromServer(): skipping update Session ID since the browser does not have a SessionID. ");
                }

            })

        },

        resetSessionId({ commit }) {
            commit('RESET_SESSION_ID')

        },

        addWindowRefreshReloadListener({ dispatch }, ) {
            console.log("addWindowRefreshReloadListener(): entered action")
            window.addEventListener('beforeunload', function (e) {
                // dispatch('sendRemoveSessionRequest')
            });
        },

        sendRemoveSessionRequest({ getters, commit }) {

            let request = {
                sessionId: getters['session/getSessionId']
            }
            console.log('sendRemoveSessionRequest(): request' + JSON.stringify(request))

            this._vm.$socket.emit(SOCKET_EVENTS.END_SESSION, request, resp => {
                console.log('sendRemoveSessionRequest():' + JSON.stringify(resp))
                commit('SET_SESSION_ID', resp.sessionId)
                resolve(resp);
            })
        }
    },
    getters: {

        // getSession(state) {
        //     console.log("getSession(): state.session=", state.session)
        //     return state.sessionId
        // },

        getSessionId(state) {
            return state.sessionId
        },
        getIpAddress(state) {
            return state.ipAddress
        }
    }
}

// const state = initialState

// const mutations = {
//     RESET_SESSION_ID(state) {
//         state.sessionId = null
//     },
//     SET_SESSION_ID(state, sessionId) {
//         state.sessionId = sessionId
//         //state.socketRequest.sessionId = payload.sessionId
//         $cookies.set('sessionId', sessionId)
//         console.log('Setting Session Id in Cookies: ' + JSON.stringify($cookies.get('sessionId')))
//     },

//     SET_IP_ADDRESS(state, ip) {
//         state.ipAddress = ip
//     },
// }

// const actions = {

//     async requestSessionFromServer({ getters, commit }) {
//         return new Promise((resolve) => {
//             let request = {
//                 ipAddress: getters.getIpAddress
//             }
//             console.log('requestSessionFromServer(): request=' + JSON.stringify(request))
//             this._vm.$socket.emit(SOCKET_EVENTS.GET_SESSION, request, resp => {
//                 console.log('requestSessionFromServer():' + JSON.stringify(resp))
//                 commit('SET_SESSION_ID', resp.sessionId)
//                 resolve(resp);
//             })
//         })
//     },
//     async updateIpAddress({ commit, dispatch, getters }) {

//         //Call Utility function to retreive IP Address for this client
//         Utils.getIpAddressForClient()
//             .then(ip => {
//                 console.log('updateIpAddress(): received IP:', ip)
//                 commit('SET_IP_ADDRESS', ip)

//                 if (getters['session/getSessionId'] === null) {
//                     console.log('updateIpAddress(): Getting SessionId for IP Address:' + ip)
//                     dispatch('requestSessionFromServer')
//                 }
//             })
//             .catch(error => {
//                 console.error('updateIpAddress(): error=' + error.message)
//             })
//     },
//     resetSessionId({ commit }) {
//         commit('RESET_SESSION_ID')

//     }

// }
// const getters = {
//     getSession() {
//         console.log("getSession(): state.session=", state.session)
//         return state.session
//     },
//     getIpAddress() {
//         return state.ipAddress
//     }
// }

// export default {
//     namespaced: false,
//     state,
//     getters,
//     mutations,
//     actions
// }