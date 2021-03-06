import { AGENT_STATES, SOCKET_EVENTS } from "@/defines";
import logger from "@/services/logger";
function initialState() {
  return {
    agentState: AGENT_STATES.UNKNOWN,
    reasonCode: 0,
    displayLabel: "-",
    agentId: null,
    deviceId: null,
    password: null,
    workMode: "auto",
    rememberCredentials: true,
    monitorAgentInterval: null,

    fullAuxCodeList: [],
    agentStateDisplayLabelMap: null,
    agentReasonCodeDisplayLabelMap: null
  };
}

export default {
  namespaced: false,
  state: initialState,

  getters: {
    getAgent(state) {
      return state;
    },

    getAgentState(state) {
      return state.agentState;
    },

    getAgentAuxState(state) {
      return {
        state: state.agentState,
        reasonCode: state.reasonCode,
        label: state.displayLabel
      };
    },
    getAgentCredentials(state) {
      return {
        agentId: state.agentId,
        deviceId: state.deviceId,
        password: state.password,
        workMode: state.workMode
      };
    },
    getFullAuxCodeList(state) {
      return state.fullAuxCodeList;
    },
    getMonitorAgentHandle(state) {
      return state.monitorAgentInterval;
    }
  },

  actions: {
    initializeReasonCodes({ commit, getters }) {
      /*************************************************************
       * Fetching the agent reason code and default agent state list
       * from config file. COnverting the list into a searchable Map
       * and storing it into the store. This allows us to search the
       * object by keys instead of index
       ***********************************************/
      let config = getters["session/getConfig"];
      let reasonCodeArray = config.AGENT_REASON_CODE_LIST;
      var reasonCodeMap = reasonCodeArray.reduce(function(map, obj) {
        map[obj.reasonCode] = obj.reasonLabel;
        return map;
      }, {});

      let auxArray = config.AVAILABLE_AGENT_STATES;
      var auxMap = auxArray.reduce(function(map, obj) {
        map[obj.state] = obj.label;
        return map;
      }, {});

      //Update the full agent aux code list, which is fetched and displayed in the dropdown
      commit("UPDATE_FULL_AUX_CODE_LIST", config);

      //Set the list of labels to be displayed for the agent state as well as reason code
      commit("SET_DISPLAY_LABELS", [auxMap, reasonCodeMap]);
    },
    startAgentStateMonitoring({ commit, dispatch, getters }) {
      let monitorAgentInterval = setInterval(() => {
        //logger.log("startAgentStateMonitoring(): querying agent state")
        dispatch("sendQueryAgentStateRequest");
      }, getters["session/getConfig"].AGENT_STATE_POLLING_INTERVAL_MS);
      commit("SET_MONITOR_AGENT_INTERVAL_HANDLE", monitorAgentInterval);
    },

    stopAgentStateMonitoring({ commit, getters }) {
      clearInterval(getters.getMonitorAgentHandle);
      commit("RESET_MONITOR_AGENT_INTERVAL_HANDLE");
    },

    setAgentState({ commit }, agentState) {
      commit("SET_AGENT_STATE", agentState);
    },

    setAgentLoginCredentials({ commit }, credentials) {
      commit("SET_AGENT_LOGIN_CREDENTIALS", credentials);
    },

    setAgentAuxCode({ commit }, auxCodeObj) {
      commit("SET_AGENT_AUX_CODE", auxCodeObj);
    },
    sendAgentLoginRequest({ dispatch, getters }) {
      return new Promise(resolve => {
        let agent = getters.getAgent;
        let sessionId = getters["session/getSessionId"];
        logger.log("sendAgentLoginRequest(): sessionId=", sessionId);
        let request = {
          sessionId: sessionId,
          agentId: agent.agentId,
          deviceId: agent.deviceId,
          password: agent.password,
          workMode: agent.workMode
        };
        logger.log("sendAgentLoginRequest(): request: " + JSON.stringify(request));
        try {
          this._vm.$socket.emit(SOCKET_EVENTS.AGENT_LOGIN, request, resp => {
            logger.log("sendAgentLoginRequest(): response: " + JSON.stringify(resp));

            if (resp.responseCode === "0") {
              dispatch("processAgentLogin");
              resolve(resp);
            } else {
              if (resp.responseCode !== "35") {
                dispatch("showErrorBanner", ["Agent Login failed:", resp.responseMessage]);
              }

              resolve(resp);
            }
          });
        } catch (error) {
          resolve(error);
        }
      });
    },

    async sendAgentLogoutRequest({ dispatch, getters }) {
      let agent = getters.getAgent;
      let sessionId = getters["session/getSessionId"];
      let request = {
        sessionId: sessionId,
        agentId: agent.agentId,
        deviceId: agent.deviceId,
        password: agent.password,
        workMode: agent.workMode
      };
      logger.log("sendAgentLogoutEvent(): request: " + JSON.stringify(request));

      this._vm.$socket.emit(SOCKET_EVENTS.AGENT_LOGOFF, request, resp => {
        logger.log("sendAgentLogoutEvent(): response: " + JSON.stringify(resp));

        if (resp.responseCode === "0") {
          dispatch("processAgentLogout");
          dispatch("session/resetSessionId");
        } else {
          dispatch("showErrorBanner", ["Agent Logout failed:", resp.responseMessage]);
        }
        return resp;
      });
    },

    async sendAgentStateRequest({ getters, commit, dispatch }, auxRequest) {
      return new Promise((resolve, reject) => {
        let request = {
          sessionId: getters["session/getSessionId"],
          agentId: getters.getAgentCredentials.agentId,
          deviceId: getters.getAgentCredentials.deviceId,
          agentState: auxRequest.state,
          reasonCode: auxRequest.reasonCode
        };

        logger.log("sendAgentStateRequest(): request= " + JSON.stringify(request));

        this._vm.$socket.emit("SETAGTSTATE", request, resp => {
          logger.log("sendAgentStateRequest(): response= " + JSON.stringify(resp));
          if (resp.responseCode === "0") {
            commit("SET_AGENT_STATE", resp.agentState);

            dispatch("setUpdatedAuxCode", resp);

            resolve(resp);
          } else {
            reject(resp);
          }
        });
      });
    },

    sendQueryAgentStateRequest({ getters, commit, dispatch }) {
      let agent = getters.getAgent;
      let sessionId = getters["session/getSessionId"];

      let request = {
        sessionId: sessionId,
        agentId: agent.agentId,
        deviceId: agent.deviceId
      };

      this._vm.$socket.emit(SOCKET_EVENTS.QUERY_AGENT_STATE, request, resp => {
        if (resp.responseCode === "0") {
          if (resp.agentState && getters.getAgentAuxState.state !== resp.agentState) {
            commit("SET_AGENT_STATE", resp.agentState);

            dispatch("setAgentAuxCode", {
              state: resp.agentState,
              reasonCode: resp.reasonCode
            });
          }

          return resp;
        } else {
          if (resp.responseCode === "04" && resp.agentState === AGENT_STATES.LOG_OUT) {
            commit("SET_AGENT_STATE", resp.agentState);
          }
          //dispatch('showErrorBanner', ['Could not fetch agent state:', resp.responseMessage])
        }
        return resp;
      });
    },
    queryAgentState() {},

    async processAgentLogin({ commit, dispatch }) {
      await dispatch("session/loadConfigurations");
      dispatch("initializeReasonCodes");

      commit("SET_AGENT_STATE_LOGIN");
      dispatch("sendQueryAgentStateRequest");
    },
    processAgentLogout({ dispatch, commit }) {
      dispatch("resetAllModules");
      commit("SET_AGENT_STATE_LOGOUT");
      dispatch("stopAgentStateMonitoring");
    },
    /********************************* */
    setUpdatedAuxCode({ commit }, payload) {
      logger.log("setUpdatedAuxCode(): payload=" + JSON.stringify(payload));

      let selectedAuxCode = {
        agentState: payload.agentState,
        reasonCode: payload.reasonCode,
        label: "Not Set"
      };

      commit("SET_AGENT_AUX_CODE", selectedAuxCode);
    }
  },

  mutations: {
    RESET_AGENT_MODULE(state) {
      let agentCredentials = {
        agentId: state.agentId,
        deviceId: state.deviceId,
        password: state.password,
        workMode: state.workMode
      };
      Object.assign(state, initialState());
      if (state.rememberCredentials === true) {
        state.agentId = agentCredentials.agentId;
        state.deviceId = agentCredentials.deviceId;
        state.password = agentCredentials.password;
        state.workMode = agentCredentials.workMode;
      }

      state.agentState = AGENT_STATES.UNKNOWN;
      state.reasonCode = 0;
      state.displayLabel = "-";
      state.monitorAgentInterval = null;
      state.fullAuxCodeList.length = 0;
      state.agentStateDisplayLabelMap = null;
      state.agentReasonCodeDisplayLabelMap = null;
    },

    UPDATE_FULL_AUX_CODE_LIST(state, config) {
      const agentReasonCodeList = config.AGENT_REASON_CODE_LIST;
      for (let i = 0; i < config.AVAILABLE_AGENT_STATES.length; i++) {
        state.fullAuxCodeList.push(config.AVAILABLE_AGENT_STATES[i]);
      }
      for (let i = 0; i < agentReasonCodeList.length; i++) {
        state.fullAuxCodeList.push({
          label: agentReasonCodeList[i].reasonLabel,
          state: AGENT_STATES.NOT_READY,
          reasonCode: agentReasonCodeList[i].reasonCode,
          userSelectable: true
        });
      }
    },
    SET_DISPLAY_LABELS(state, [auxMap, reasonCodeMap]) {
      logger.log("auxCodes" + JSON.stringify(auxMap));
      state.agentStateDisplayLabelMap = auxMap;
      state.agentReasonCodeDisplayLabelMap = reasonCodeMap;
    },
    SET_AGENT_LOGIN_CREDENTIALS(state, credentials) {
      state.agentId = credentials.agentId;
      state.deviceId = credentials.deviceId;
      state.password = credentials.password;
      state.workMode = credentials.workMode;
    },

    SET_AGENT_STATE_LOGIN(state) {
      state.agentState = AGENT_STATES.LOG_IN;
    },

    SET_AGENT_STATE_LOGOUT(state) {
      state.agentState = AGENT_STATES.LOG_OUT;
    },

    SET_AGENT_STATE(state, agentState) {
      state.agentState = agentState;
    },

    SET_AGENT_AUX_CODE(state, payload) {
      state.reasonCode = payload.reasonCode;
      state.agentState = payload.state;
      if (payload.state === AGENT_STATES.NOT_READY) {
        state.displayLabel = state.agentReasonCodeDisplayLabelMap[payload.reasonCode];
      } else {
        state.displayLabel = state.agentStateDisplayLabelMap[payload.state];
      }
    },
    SET_MONITOR_AGENT_INTERVAL_HANDLE(state, handle) {
      state.monitorAgentInterval = handle;
    },
    RESET_MONITOR_AGENT_INTERVAL_HANDLE(state) {
      state.monitorAgentInterval = null;
    }
  }
};
