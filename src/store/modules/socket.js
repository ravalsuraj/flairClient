import { SOCKET_EVENTS, SOCKET_STATES } from "@/defines.js";
import logger from "@/services/logger";
function initialState() {
  return {
    status: SOCKET_STATES.DISCONNECTED
  };
}
export default {
  state: initialState,
  mutations: {
    RESET_SOCKET_MODULE(state) {
      Object.assign(state, initialState());
    },

    /******************* SOCKETIO STATE MUTATIONS *********************/
    SET_SOCKET_STATE_CONNECTED(state) {
      state.status = SOCKET_STATES.CONNECTED;
    },
    SET_SOCKET_STATE_DISCONNECTED(state) {
      state.status = SOCKET_STATES.DISCONNECTED;
    }
  },
  actions: {
    setSocketStateConnected({ commit, dispatch }) {
      commit("SET_SOCKET_STATE_CONNECTED");
      dispatch("sendSessionRejoinEvent");
    },

    sendSessionRejoinEvent({ getters }) {
      let sessionId = getters["session/getSessionId"];
      if (sessionId) {
        let request = {
          sessionId: sessionId
        };
        logger.log("sendSessionRejoinEvent(): request=" + JSON.stringify(request));

        this._vm.$socket.emit(SOCKET_EVENTS.REJOIN_SESSION, request, response => {
          logger.log("sendSessionRejoinEvent(): response=" + JSON.stringify(response));
        });
      }
    },
    setSocketStateDisconnected({ commit }) {
      commit("SET_SOCKET_STATE_DISCONNECTED");
    },

    processSocketConnected({ getters, dispatch }) {
      dispatch("setSocketStateConnected");
      dispatch("session/loadConfigurations");
      dispatch("startAgentStateMonitoring");

      dispatch("session/fetchExistingSessionFromServer", { root: true })
        .then(resp => {
          logger.log(
            "processSocketConnected(): response received from fetchExistingSessionFromServer: resp=" +
              JSON.stringify(resp)
          );
          logger.log(
            "responseCode " +
              (resp.responseCode === 0 ? "Not " : "is ") +
              "zero. sessionID not retreived. sessionId=" +
              getters["session/getSessionId"]
          );
          if (resp.responseCode === "0" && getters["session/getSessionId"].length) {
            logger.log("processSocketConnected(): sending request for sendQueryAgentStateRequest");
            dispatch("sendQueryAgentStateRequest", { root: true });
            dispatch("sendQueryCallStateRequest", { root: true });
          } else {
            logger.log("processSocketConnected(): skipping request for sendQueryAgentStateRequest");
          }
        })
        .catch(() => {
          dispatch("processAgentLogout");
        });
    },

    /**********************************
     *  INCOMING SOCKET REQUESTS
     **********************************/
    SOCKET_DEVEVENT(payload) {
      logger.log("SOCKET_DEVEVENT(): Received event: " + JSON.stringify(payload));
    },

    SOCKET_TEST_CONN_DROPPED(payload) {
      logger.log("SOCKET_TEST_CONN_DROPPED(): Received event: " + JSON.stringify(payload));
    },
    SOCKET_TEST_TERM_CONN_DROPPED(payload) {
      logger.log("SOCKET_TEST_TERM_CONN_DROPPED(): Received event: " + JSON.stringify(payload));
    },

    SOCKET_ICALLRING({ dispatch }, payload) {
      logger.log("SOCKET_ICALLRING(): Received event: " + JSON.stringify(payload));

      dispatch("processNewInboundCall", payload);
    },

    SOCKET_ICALLTALK({ dispatch, getters }, payload) {
      logger.log("SOCKET_ICALLTALK(): Received event: " + JSON.stringify(payload));
      if (getters.getCallIndexByCallId(payload.callId) !== null) {
        dispatch("setCallStateTalking", payload);
      } else {
        logger.log("SOCKET_ICALLTALK(): not identified for call OR conf call");
      }
    },

    SOCKET_ICALLDISC({ dispatch, getters }, payload) {
      logger.log("SOCKET_ICALLDISC(): Received event: " + JSON.stringify(payload));
      if (getters.getCallIndexByCallId(payload.callId) !== null) {
        dispatch("setCallStateDropped", payload);
      } else {
        logger.log("SOCKET_ICALLDISC(): no calls found for UCID:" + payload.ucid);
      }
    },

    SOCKET_ICALLHLD({ dispatch, getters }, payload) {
      logger.log("SOCKET_ICALLHLD(): Received event: " + JSON.stringify(payload));
      if (getters.getCallIndexByCallId(payload.callId) !== null) {
        dispatch("setCallStateHeld", payload);
      } else {
        logger.log("SOCKET_ICALLHLD() call ID not found in list of calls");
      }
    },

    SOCKET_CALLCONF({ dispatch, getters }, payload) {
      logger.log("SOCKET_CALLCONF(): Received event: " + JSON.stringify(payload));
      if (getters.getCallIndexByCallId(payload.callId) < 0) {
        dispatch("processNewConferenceCall", payload);
      }
      dispatch("setMultiCallStateConferenced", payload);
    },

    SOCKET_CONFCALLDISC({ dispatch }, payload) {
      logger.log("SOCKET_CONFCALLDISC(): Received event: " + JSON.stringify(payload));
      dispatch("processConferenceConnectionDisconnect", payload);
    },

    SOCKET_OUTCALLRING({ dispatch, getters }, payload) {
      logger.log("SOCKET_OUTCALLRING(): Received event: " + JSON.stringify(payload));
      if (getters.getCallIndexByCallId(payload.callId) < 0) {
        dispatch("addCallToActiveCalls", payload).then(() => {
          dispatch("processNewOutboundCall", payload);
          dispatch("setCallStateRinging", payload);
        });
      } else {
        dispatch("setCallStateRinging", payload);
      }
    },

    SOCKET_OUTCALLTALK({ dispatch, getters }, payload) {
      logger.log("SOCKET_OUTCALLTALK(): Received event: " + JSON.stringify(payload));
      if (getters.getCallIndexByCallId(payload.callId) < 0) {
        dispatch("addCallToActiveCalls", payload).then(() => {
          dispatch("processNewOutboundCall", payload);
          dispatch("setCallStateTalking", payload);
        });
      } else {
        dispatch("setCallStateTalking", payload);
      }
    },

    SOCKET_OUTCALLDISC({ dispatch }, payload) {
      logger.log("SOCKET_OUTCALLDISC(): Received event: " + JSON.stringify(payload));
      dispatch("setCallStateDropped", payload);
    },

    SOCKET_OUTCALLHLD({ dispatch }, payload) {
      logger.log("SOCKET_OUTCALLHLD(): Received event: " + JSON.stringify(payload));
      dispatch("setCallStateHeld", payload);
    },
    SOCKET_AGTUPDATED({ commit, dispatch }, payload) {
      logger.log("SOCKET_AGTUPDATED(): Received event: " + JSON.stringify(payload));
      commit("SET_AGENT_STATE", payload.agentState);

      dispatch("setUpdatedAuxCode", payload);
    },

    SOCKET_AVAYACONNDISC({}, payload) {
      logger.log("SOCKET_AVAYACONNDISC(): Received event: " + JSON.stringify(payload));
    },
    SOCKET_AVAYACONNRECONN({}, payload) {
      logger.log("SOCKET_AVAYACONNRECONN(): Received event: " + JSON.stringify(payload));
    }
  },
  getters: {
    getSocketStatus(state) {
      return state.status;
    }
  }
};
