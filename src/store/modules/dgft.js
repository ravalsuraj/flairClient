import dgftMiddlewareConnector from "@/services/dgftMiddlewareConnector.js";

function initialState() {
  //hard-coded UUI for testing
  return {
    dgftSugarCrmUrl: null,

    uui: [],
    //hard-coded Caller Data for testing
    callerData: [
      {
        key: "Name",
        value: ""
      }
    ]
  };
}

export default {
  state: initialState,

  actions: {
    initializeSugarCrmUrl({ getters, commit }) {
      let config = getters["session/getConfig"];
      commit("RESET_CRM_URL", config.DGFT.CRM.URL);
    },
    setDgftUui({ commit, getters }, receivedUui) {
      const config = getters["session/getConfig"];
      const uui = {
        keys: config.DGFT.UUI_KEYS,
        values: receivedUui
      };
      commit("SET_DGFT_UUI", uui);
    },

    setCallerData({ commit }, payload) {
      commit("SET_CALLER_DATA", payload);
    },

    dgft_fetchSugarCrmUrl({ commit, dispatch, getters }, inboundCallId) {
      let path = "";
      let call = dispatch("getCallByCallId", inboundCallId);

      if (call && call.callingAddress !== "") {
        let uui = getters.getDgftUui;
        let screenpopBuilderRequest = {
          cli: call.callingAddress,
          uui: uui,
          baseUrl: getters["session/getConfig"].DGFT.CRM.URL,
          agentId: getters.getAgentCredentials.agentId,
          sessionId: getters["session/getSessionId"]
        };

        // Set the relative path based on customer RMN and IEC status

        //check if the UUI contains an RMN and IEC Field. In this case, no need to call SugarCRM API for it
        if (uui && uui["RMN"] && uui["IECStatus"]) {
          if (uui["RMN"].toLowerCase() === "n") {
            //Not RMN, so screenpop the Create Contact Page
            path = "/#Contacts/create?";
          } else if (uui["RMN"].toLowerCase() === "y") {
            //RMN, so check if status is IEC
            if (uui["IECStatus"].toLowerCase() === "y") {
              //Status is IEC, so screenpop the accounts search page
              path = "/index.php?module=Accounts&searchFormTab=basic_search&";
            } else if (uui["IECStatus"].toLowerCase() === "n") {
              //Status is IEC, so screenpop the contacts search page
              path = "/index.php?module=Contacts&searchFormTab=basic_search&";
            }
          }
        } else {
          //since UUI not found, call SugarCRM API to check for RMN and IEC statu
          dgftMiddlewareConnector.checkRMN(screenpopBuilderRequest).then(resp => {
            if (resp && resp.data && resp.data.number) {
              if (resp.data.number.toLowerCase() === "not found") {
                //build URL for new caller
                path = "/#Contacts/create?";
              } else if (resp.data.number.toLowerCase() === "found") {
                if (resp.data.module.toLowerCase() === "iec") {
                  path = "/index.php?module=Accounts&searchFormTab=basic_search&";
                } else if (resp.data.module.toLowerCase() === "contacts") {
                  path = "/index.php?module=Contacts&searchFormTab=basic_search&";
                }
              }
            }
          });
        }
        screenpopBuilderRequest.path = path;

        commit("SET_DGFT_SCREENPOP_URL", screenpopBuilderRequest);
      } else {
        console.error("dgft_fetchSugarCrmUrl(): call could not be retreived");
      }
    }
  },

  mutations: {
    RESET_DATA_MODULE(state) {
      Object.assign(state, initialState());
    },

    RESET_CRM_URL(state, url) {
      state.dgftSugarCrmUrl = url;
    },

    SET_DGFT_SCREENPOP_URL(state, payload) {
      const params =
        "phone_office=" +
        payload.cli +
        "&ucid=" +
        payload.uui.UCID +
        "&complaintno=" +
        payload.uui.ConplaintNo +
        "+&rmn=" +
        payload.uui.RMN +
        "&lang=" +
        payload.uui.lang +
        "&lastshortcode=" +
        payload.uui.LastShortCode +
        "&agentId=" +
        payload.agentId +
        "&sessionId=" +
        payload.sessionId;
      state.dgftSugarCrmUrl = payload.baseUrl + payload.path + params;
    },

    SET_DGFT_UUI(state, payload) {
      const uuiKeys = payload.keys;
      let uuiValues = payload.values.split("|");

      for (let i = 0; i < uuiKeys.length; i++) {
        let tempJson = {};
        tempJson[uuiKeys[i]] = uuiValues[i];
        state.uui.push(tempJson);
      }
    },

    SET_CALLER_DATA(state) {
      state.callerData[0].value = "Suraj Raval";
    }
  },
  getters: {
    getCallerData(state) {
      return state.callerData;
    },
    getDgftUui(state) {
      return state.uui;
    },
    getSugarAccessToken(state) {
      return state.crm.access_token;
    },
    getSugarAccountId(state) {
      return state.crm.accountId;
    },
    getComputedCrmUrl(state) {
      return state.crm.dgftSugarCrmUrl;
    },
    getCrmUrl() {
      return "http://localhost:4000";
    }
  }
};
