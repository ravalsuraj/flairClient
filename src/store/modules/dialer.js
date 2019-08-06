import { CALL_STATES, SOCKET_EVENTS } from '@/defines.js'
function initialState() {
    return {
        dialedDigits: null
    }
}

export default {
    namespaced: false,
    state: initialState,
    getters: {
        getDialedDigits(state) {
            return state.dialedDigits
        }
    },
    mutations: {

        RESET_DIALER_MODULE(state) {
            Object.assign(state, initialState())
        },

        UPDATE_DIALED_DIGITS(state, inpDigits) {
            state.dialedDigits = inpDigits;
        }
    },
    actions: {
        updateDialedDigits({ commit }, inpDigits) {
            commit('UPDATE_DIALED_DIGITS', inpDigits)
        }
    }
}

