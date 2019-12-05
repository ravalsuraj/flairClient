import {
    TIMER_STATES,
    TIMER_DIRECTIONS
} from '@/defines.js'

function initialState() {
    return {
        timers: {
            timerA: {
                refTime: null,
                direction: TIMER_DIRECTIONS.UP,
                state: 0
            },
        },
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

        //Persist Timer Mutations:
        ADD_UP_TIMER(state, timerName) {
            if (!state.timers[timerName]) {
                state.timers[timerName] = {};
                state.timers[timerName] = {
                    state: TIMER_STATES.STOP,
                    direction: TIMER_DIRECTIONS.UP,
                    refTime: null
                };
            }
        },

        ADD_DOWN_TIMER(state, timerName) {
            if (!state.timers[timerName]) {
                state.timers[timerName] = {};
                state.timers[timerName] = {
                    state: TIMER_STATES.STOP,
                    direction: TIMER_DIRECTIONS.DOWN,
                    refTime: null
                };
            }
        },

        REMOVE_TIMER(state, timerName) {
            if (state.timers[timerName]) {
                delete state.timers[timerName]
            }

        },
        STOP_TIMER(state, timerName) {
            state.timers[timerName].state = 0;
            state.timers[timerName].refTime = null;
        },

        START_TIMER(state, timerName) {
            state.timers[timerName].refTime = new Date().getTime();
            state.timers[timerName].state = 1;
        },

        PAUSE_TIMER(state, timerName) {
            state.timers[timerName].state = 2;
        },
        RESTART_TIMER(state, timerName) {
            state.timers[timerName].state = 3;
            state.timers[timerName].refTime = new Date().getTime();
        }
    },
    actions: {
        addUpTimer({ commit }, timerName) {
            commit('ADD_UP_TIMER', timerName)
        },
        addDownTimer({ commit }, timerName) {
            commit('ADD_DOWN_TIMER', timerName)
        },
        removeTimer({ commit }, timerName) {
            commit('REMOVE_TIMER', timerName)
        },
        startTimer({ commit }, timerName) {
            commit("START_TIMER", timerName);
        },

        stopTimer({ commit }, timerName) {
            commit("STOP_TIMER", timerName);
        },
    },
    getters: {
        getTimers(state) {
            return state.timers;
        },
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