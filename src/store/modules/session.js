import { SOCKET_EVENTS } from "@/defines.js";
import Utils from "@/services/Utils";
import axios from "axios";
import logger from "@/services/logger";
function initialState() {
  return {
    ipAddress: "0.0.0.0",
    sessionId: null,
    config: null
  };
}

export default {
  namespaced: true,

  state: initialState,

  mutations: {
    RESET_SESSION_MODULE(state) {
      Object.assign(state, initialState());
    },

    RESET_SESSION_ID(state) {
      state.sessionId = null;
      sessionStorage.removeItem("loggableSessionId");
    },

    SET_SESSION_ID(state, sessionId) {
      sessionStorage.setItem("loggableSessionId", sessionId);
      state.sessionId = sessionId;
    },

    SET_IP_ADDRESS(state, ip) {
      state.ipAddress = ip;
    },
    LOAD_CONFIG_FILE(state, payload) {
      state.config = payload;
    }
  },
  actions: {
    loadConfigurations({ commit }) {
      return axios.get("./settings.json").then(response => {
        logger.log("settings loaded. settings=", response.data);
        commit("LOAD_CONFIG_FILE", response.data);
      });
    },

    async requestSessionFromServer({ getters, commit }) {
      logger.log("requestSessionFromServer(): entered action");
      return new Promise((resolve, reject) => {
        let request = {
          ipAddress: getters.getIpAddress
        };
        logger.log("requestSessionFromServer(): request=" + JSON.stringify(request));
        try {
          this._vm.$socket.emit(SOCKET_EVENTS.GET_SESSION, request, resp => {
            logger.log("requestSessionFromServer():" + JSON.stringify(resp));
            commit("SET_SESSION_ID", resp.sessionId);
            resolve(resp);
          });
        } catch (ex) {
          reject(ex);
        }
      });
    },

    async updateIpAddress({ commit, dispatch, getters }) {
      //Call Utility function to retreive IP Address for this client
      Utils.getIpAddressForClient()
        .then(ip => {
          logger.log("updateIpAddress(): received IP:", ip);
          commit("SET_IP_ADDRESS", ip);

          if (getters["session/getSessionId"] === null) {
            logger.log("updateIpAddress(): Getting SessionId for IP Address:" + ip);
            dispatch("session/requestSessionFromServer");
          }
        })
        .catch(error => {
          console.error("updateIpAddress(): error=" + error.message);
        });
    },

    async fetchExistingSessionFromServer({ getters, commit }) {
      logger.log("fetchExistingSessionFromServer(): entered action");
      return new Promise((resolve, reject) => {
        let sessionId = getters["getSessionId"];

        if (sessionId) {
          let request = {
            sessionId: sessionId
          };
          logger.log("fetchExistingSessionFromServer(): request=" + JSON.stringify(request));

          this._vm.$socket.emit(SOCKET_EVENTS.CHECK_SESSION, request, resp => {
            logger.log("fetchExistingSessionFromServer():" + JSON.stringify(resp));

            if (resp && resp.sessionId) {
              commit("SET_SESSION_ID", resp.sessionId);
              commit("SET_IP_ADDRESS", resp.ipAddress);
              resolve(resp);
            } else {
              logger.log(
                "fetchExistingSessionFromServer(): skipping update Session ID since the response does not contain a session ID. resp=",
                JSON.stringify(resp)
              );
              reject(resp);
            }
          });
        } else {
          logger.log(
            "fetchExistingSessionFromServer(): skipping update Session ID since the browser does not have a SessionID. "
          );
          reject();
        }
      });
    },

    resetSessionId({ commit }) {
      commit("RESET_SESSION_ID");
    },

    sendRemoveSessionRequest({ getters, commit }) {
      new Promise(resolve => {
        let request = {
          sessionId: getters["session/getSessionId"]
        };
        logger.log("sendRemoveSessionRequest(): request" + JSON.stringify(request));

        this._vm.$socket.emit(SOCKET_EVENTS.END_SESSION, request, resp => {
          logger.log("sendRemoveSessionRequest():" + JSON.stringify(resp));
          commit("SET_SESSION_ID", resp.sessionId);
          resolve(resp);
        });
      });
    },

    addWindowRefreshReloadListener() {
      logger.log("addWindowRefreshReloadListener(): entered action");
      // window.addEventListener('beforeunload', function(e) {
      //   //dispatch('sendRemoveSessionRequest')
      // })
    }
  },
  getters: {
    getSessionId(state) {
      return state.sessionId;
    },
    getIpAddress(state) {
      return state.ipAddress;
    },
    getConfig(state) {
      return state.config;
    }
  }
};
