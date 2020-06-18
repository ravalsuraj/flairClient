      }
<template>
  <widget title="Agent Note">
    <template v-slot:body>
      <div class="list-group px-3">
        <div class="form-group" v-if="isCurrentCallActive">
          <div style="text-align:right;">{{ calNotesLength }} / 250</div>
          <textarea
            v-model="Notevalue"
            class="form-control rounded-0"
            id="exampleFormControlTextarea2"
            rows="5"
            @keydown="onKeyDown"
          ></textarea>
          
        </div>
        <div v-else>
          <h4 class="grey-text">Waiting for call</h4>
        </div>
      </div>
    </template>
  </widget>
</template>

<script>
import Widget from "@/components/agc/Widget";
import { CALL_STATES } from "@/defines.js";
export default {
  name: "AgentNote",
  components: {
    Widget
  },
  mounted() {},
  props: {
    msg: String
  },

  data() {
    return {
      showWidget: true,
      Notevalue: "",
      notesLength: 0
    };
  },

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget;
    },
    onKeyDown(evt) {
      if (this.Notevalue.length >= 250) {
        if ((evt.keyCode >= 48 && evt.keyCode <= 90) || evt.keyCode == 32) {
          evt.preventDefault();
          return;
        }
      }
    },

    async agentNoteUpdate() {
      let req = {
        AgentNotes: this.Notevalue,
        cli: this.currentCallCli,
        ucid: this.currentCallUcid
      };

      let resp = await this.$store.dispatch("updateAgentNotes", req);

      if (resp === "success") {
        this.Notevalue = "";
      } else {
        console.error("resp was not successful. resp=" + JSON.stringify(resp));
      }
    }
  },
  computed: {
    myCall() {
      //let index = this.$store.getters.getCallIndex("1234");

      let myCall = this.$store.getters.getCallByIndex(0);
      if (myCall) {
        return myCall;
      } else {
        return null;
      }
    },
    currentCallState() {
      if (this.myCall) {
        return this.myCall.status;
      } else {
        return null;
      }
    },
    isCurrentCallActive() {
      return (
        this.currentCallState === CALL_STATES.TALKING ||
        this.currentCallState === CALL_STATES.RINGING ||
        this.currentCallState === CALL_STATES.HELD)
    },
    currentCallUcid() {
      if (this.myCall) {
        return this.myCall.ucid;
      } else {
        return null;
      }
    },
    currentCallCli() {
      if (this.myCall) {
        return this.myCall.callingAddress;
      } else {
        return null;
      }
    },
    calNotesLength() {
      //  if (this.Notevalue.length >= 250) {
      //    this.Notevalue = this.Notevalue.substring(0, 250);
      //  }
      return this.Notevalue.length;
    }
  },
  watch: {
    currentCallState(newState, oldState) {
      console.log("call state changed from:" + oldState + " to " + newState);
      if (newState !== null) {
        if (newState === CALL_STATES.DROPPED) {
          this.agentNoteUpdate();
          //  this.$store.dispatch("updateAgentNotes", this.Notevalue);
        }
      }
    },

    calNotesLength() {
      if (this.Notevalue.length >= 251) {
        this.Notevalue = this.Notevalue.substring(0, 250);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>