import dgftMiddlewareConnector from "@/services/dgftMiddlewareConnector.js";

function initialState() {
  //hard-coded UUI for testing
  return {
    dgftCallToProcess: {
      call: null,
      callId: null,
      callIndex: null
    },
    dgftCrmUrl: [],
    dgftUui: []
  };
}

export default {
  state: initialState,

  actions: {
    processNewDgftCall({ commit, dispatch, getters }, callId) {
      let call = getters.getCallByCallId(callId);
      if (getters.getCallIndexByCallId(call.callId) === 0) {
        const callIndex = getters.getCallIndexByCallId(call.callId);
        commit("SET_DGFT_CALL_TO_PROCESS", [callId, callIndex, call]);
      }
      dispatch("setDgftUuiForCall", call);
      dispatch("setDgftCrmUrlForCall", call);
    },
    processDgftCallCleared({ commit, dispatch }, callIndex) {
      commit("RESET_DGFT_CALL_TO_PROCESS");
      dispatch("resetDgftCrmUrlForCall", callIndex);
      dispatch("resetDgftUuiForCall", callIndex);
    },

    setDgftCrmUrlForCall({ commit, getters }, call) {
      let callIndex = getters.getCallIndexByCallId(call.callId);
      let path = "";
      const uui = getters.getDgftUuiByCallIndex(callIndex);

      if (call && call.callingAddress !== "") {
        let screenpopBuilderRequest = {
          callId: call.callId,
          cli: call.callingAddress,
          uui: uui,
          baseUrl: getters["session/getConfig"].DGFT.CRM.URL,
          agentId: getters.getAgentCredentials.agentId,
          sessionId: getters["session/getSessionId"]
        };

        // Set the relative path based on customer RMN and IEC status

        //check if the UUI contains an RMN and IEC Field. In this case, no need to call DGFT (SugarCRM) API for it
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
          //since UUI not found, call DGFT (SugarCRM) API to check for RMN and IEC statu
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

        commit("SET_DGFT_CRM_URL", screenpopBuilderRequest);
      } else {
        console.error("setDgftCrmUrlForCall(): call could not be retreived");
      }
    },

    resetDgftCrmUrlForCall({ commit }, index) {
      commit("RESET_DGFT_CRM_URL", index);
    },

    setDgftUuiForCall({ commit, getters }, call) {
      const config = getters["session/getConfig"];
      const request = {
        callId: call.callId,
        keys: config.DGFT.UUI_KEYS,
        values: call.uui
      };
      commit("SET_DGFT_UUI", request);
    },

    resetDgftUuiForCall({ commit }, callId) {
      commit("RESET_DGFT_UUI", callId);
    }
  },

  mutations: {
    RESET_DGFT_MODULE(state) {
      Object.assign(state, initialState());
    },

    SET_DGFT_CALL_TO_PROCESS(state, [callId, callIndex, call]) {
      state.dgftCallToProcess.callIndex = callIndex;
      state.dgftCallToProcess.callId = callId;
      state.dgftCallToProcess.call = call;
    },
    RESET_DGFT_CALL_TO_PROCESS(state) {
      state.dgftCallToProcess.callIndex = null;
      state.dgftCallToProcess.callId = null;
      state.dgftCallToProcess.call = null;
    },

    SET_DGFT_CRM_URL(state, payload) {
      const params =
        (payload.uui.RMN.toLowerCase() === "y" ? "/" : "") +
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

      state.dgftCrmUrl.push(payload.baseUrl + payload.path + params);
    },

    RESET_DGFT_CRM_URL(state, index) {
      if (state.dgftCrmUrl[index]) {
        state.dgftCrmUrl.splice(index, 1);
      } else {
        console.log("RESET_DGFT_CRM_URL(): skipping, since index " + index + " does not exist in dgftCrmUrl List");
      }
    },

    SET_DGFT_UUI(state, payload) {
      //UUI Keys are retreived from config file
      //UUI values are retreived as pipe separated string from IVR

      const uuiKeys = payload.keys;
      const uuiValues = payload.values.split("|");
      //const tempUui = [];
      //Loop through the array of UUI keys
      let tempJson = {};
      for (let i = 0; i < uuiKeys.length; i++) {
        //set the key of the JSON obj as the UUI key, and set it's value as the corresponsing UUI value
        tempJson[uuiKeys[i]] = uuiValues[i];
        //For the uui for the call, set the key as the callID, and push the UUI entry as a key value pair in the state
        //tempUui.push(tempJson);
      }
      state.dgftUui.push(tempJson);
    },
    RESET_DGFT_UUI(state, index) {
      if (state.dgftUui[index]) {
        state.dgftUui.splice(index, 1);
      } else {
        console.log("RESET_DGFT_UUI(): skipping, since callId does not exist in UUI List");
      }
    }
  },
  getters: {
    getSelectedDgftUui(state) {
      const callIndex = state.dgftCallToProcess.callIndex;
      return callIndex > -1 ? state.dgftUui[callIndex] : null;
    },
    getDgftUuiByCallIndex: state => callIndex => {
      if (state.dgftUui[callIndex]) {
        console.log("found DGFT UUI: state=" + JSON.stringify(state.dgftUui));
        return state.dgftUui[callIndex];
      } else {
        console.log("could not find DGFT UUI: state=" + JSON.stringify(state.dgftUui));
        return null;
      }
    },

    getSelectedDgftCrmUrl(state) {
      const callIndex = state.dgftCallToProcess.callIndex;
      return callIndex > -1 ? state.dgftCrmUrl[callIndex] : null;
    },

    getDgftCrmUrlByCallIndex: state => callIndex => {
      if (state.dgftCrmUrl[callIndex]) {
        console.log("found DGFT CRM URL: state=" + JSON.stringify(state.dgftCrmUrl));
        return state.dgftCrmUrl[callIndex];
      } else {
        console.log("did not find DGFT CRM URL: state=" + JSON.stringify(state.dgftCrmUrl));
        return null;
      }
    }
  }
};
