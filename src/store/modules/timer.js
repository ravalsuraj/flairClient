import {
    AGENT_STATES,
    CALL_STATES,
    CONNECTION_STATES,
    TIMER_STATES
} from '@/defines.js'

function initialState() {
    return {
        demo: 0,
        callStateTimer: 0
    }
}
export default {
    state: initialState,

    mutations: {

        RESET_TIMER_MODULE(state) {
            Object.assign(state, initialState())
        },

        SET_TIMER_STATE_START(state, timerName) {
            state[timerName] = TIMER_STATES.START
        },

        SET_TIMER_STATE_STOP(state, timerName) {
            state[timerName] = TIMER_STATES.STOP
        },
        SET_TIMER_STATE_PAUSE(state, timerName) {
            state[timerName] = TIMER_STATES.PAUSE
        }
    },
    actions: {
        startTimer({ commit }, timerName) {
            commit('SET_TIMER_STATE_START', timerName)
        },
        stopTimer({ commit }, timerName) {
            commit('SET_TIMER_STATE_STOP', timerName)
        },

        pauseTimer({ commit }, timerName) {
            commit('SET_TIMER_STATE_PAUSE', timerName)
        },

        togglePauseResumeTimer({ getters, dispatch }, timerName) {

            let timerState = getters.getTimer[timerName];

            if (timerState === TIMER_STATES.PAUSE) {
                dispatch('startTimer', timerName)

            } else if (timerState === TIMER_STATES.START) {
                dispatch('pauseTimer', timerName)

            } else {
                dispatch('stopTimer', timerName)

            }

        },
    },
    getters: {
        getTimer(state, timerName) {
            return state[timerName]
        }
    }
}