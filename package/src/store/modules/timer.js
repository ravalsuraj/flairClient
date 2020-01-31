import {
    TIMER_STATES,
    TIMER_DIRECTIONS
} from '@/defines.js'

function initialState() {
    return {
        demo: 0,
        callStateTimer: {
            status: TIMER_STATES.STOP,
        },

        acwTimer: {
            status: TIMER_STATES.STOP,
            expiry: 60
        },
        callTimerInstate: {
            status: TIMER_STATES.STOP
        },
        agentTimerInstate: {
            status: TIMER_STATES.STOP
        }

    }
}
export default {
    state: initialState,

    mutations: {

        RESET_TIMER_MODULE(state) {
            Object.assign(state, initialState())
        },

        SET_TIMER_STATE_START(state, timerName) {
            state[timerName].status = TIMER_STATES.START
        },

        SET_TIMER_STATE_STOP(state, timerName) {
            state[timerName].status = TIMER_STATES.STOP
        },
        SET_TIMER_STATE_PAUSE(state, timerName) {
            state[timerName].status = TIMER_STATES.PAUSE
        },
        SET_TIMER_STATE_RESET(state, timerName) {
            state[timerName].status = TIMER_STATES.RESET
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
        resetTimer({ commit }, timerName) {
            commit('SET_TIMER_STATE_RESET', timerName)
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
        getTimerStatus: (state) => (timerName) => {
            console.log("getters.getTimerStatus=" + state[timerName].status)
            return state[timerName].status
        },


        getTimerExpiry: (state) => (timerName) => {
            console.log("getTimerExpiry, timerName=", timerName)
            return state[timerName].expiry
        },
    }
}