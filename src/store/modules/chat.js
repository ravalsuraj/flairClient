

function initialState() {
    return {
        showChatSidebar: false,
        chatSessions: [
            {
                show: false,
                chatId: "1234",
                participant: {
                    initials: "SR",
                    firstName: "Suraj",
                    lastName: "Raval"
                },
                messageList: [
                    {
                        chatId: "1234",
                        type: "text",
                        self: false,
                        isInteractive: false,
                        content: {
                            text: "Hi, Welcome to AGC's Assistant. You can type your query, or click on one of the following to get started"
                        }
                    }
                ]
            },
            {
                show: false,
                chatId: "4567",
                participant: {
                    initials: "JD",
                    firstName: "John",
                    lastName: "Doe"
                },
                messageList: [
                    {
                        chatId: "4567",
                        type: "text",
                        self: false,
                        isInteractive: false,
                        content: {
                            text: "Hi, Welcome to AGC's Assistant. You can type your query, or click on one of the following to get started"
                        }
                    }
                ]
            }
        ],
        chatIds: ['1234', "4567"]
    }
}

export default {
    namespaced: false,

    state: initialState,

    mutations: {
        SET_CHAT_SIDEBAR(state, showChatSideBarFlag) {
            state.showChatSidebar = showChatSideBarFlag
        },
        RESET_CHAT_MODULE(state) {
            Object.assign(state, initialState());
        },

        ADD_MESSAGE_TO_MESSAGE_LIST(state, [chatId, newMessage]) {

            //find the position of the chat in the chatArray
            const chatIndex = state.chatIds.indexOf(chatId);

            //add an index field to add an ID to every message of the chat
            newMessage.index = state.chatSessions[chatIndex].messageList.length;

            //add the new message to the message list for the session
            state.chatSessions[chatIndex].messageList.push(newMessage);
        },
        TOGGLE_CHAT_WINDOW(state, index) {
            state.chatSessions[index].show = !state.chatSessions[index].show
        }
    },
    actions: {
        setChatSidebarState({ commit }, showChatSideBarFlag) {
            commit('SET_CHAT_SIDEBAR', showChatSideBarFlag)
        },
        toggleChatWindow({ getters, commit }, chatId) {
            let chatIndex = getters.getChatIndexById(chatId);
            if (chatIndex > -1) {
                commit('TOGGLE_CHAT_WINDOW', chatIndex)
            } else {
                console.log("chatId " + chatId + " not found in chats. chatIndex=" + chatIndex)
            }
        },
        addMessage({ commit }, [chatId, newMessage]) {
            commit("ADD_MESSAGE_TO_MESSAGE_LIST", [chatId, newMessage]);
            console.log("newMessage=" + JSON.stringify(newMessage.content.text))
            // const botResponse = getters.getMessageResponses.filter(item => item.query.toLowerCase() === newMessage.content.text.toLowerCase());
            // console.log("botResponse=" + JSON.stringify(botResponse))
            // if (botResponse && botResponse.length > 0) {
            //     commit("ADD_MESSAGE_TO_MESSAGE_LIST", botResponse[0].response);
            // }
        }
    },
    getters: {
        getChatSidebarState(state) {
            return state.showChatSidebar
        },
        getChatSessions(state) {
            return state.chatSessions
        },

        getChatSessionById: state => chatId => {
            const index = state.chatIds.indexOf(chatId);
            return state.chatSessions[index]
        },
        getChatIndexById: state => chatId => {
            return state.chatIds.indexOf(chatId);
        },
        getMessageList: state => chatId => {
            return state.chatSessions[state.chatIds.indexOf(chatId)].messageList;
        },
        getMessageListLength: state => chatId => {
            return state.chatSessions[state.chatIds.indexOf(chatId)].messageList.length;
        },

    }

}
