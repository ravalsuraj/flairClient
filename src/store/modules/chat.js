

function initialState() {
    return {
        showChatSidebar: false,
        chatSessions: [
            {
                sessionId: "1234",
                participant: {
                    firstName: "Suraj",
                    lastName: "Raval"
                },
                messageList: [
                    {
                        type: "text",
                        self: false,
                        isInteractive: false,
                        content: {
                            text: "Hi, Welcome to AGC's Assistant. You can type your query, or click on one of the following to get started"
                        }
                    }
                ]
            }],
        chatSessionIds: ['1234']
    }
}

export default {
    namespaced: false,

    state: initialState,

    mutations: {
        SET_CHAT_SIDEBAR(state, showChatSideBarFlag) {
            state.showChatSidebar = showChatSideBarFlag
        },
        RESET_QUESS_MODULE(state) {
            Object.assign(state, initialState());
        },
    },
    actions: {
        setChatSidebarState({ commit }, showChatSideBarFlag) {
            commit('SET_CHAT_SIDEBAR', showChatSideBarFlag)
        }
    },
    getters: {
        getChatSidebarState(state) {
            return state.showChatSidebar
        }
    }
}
