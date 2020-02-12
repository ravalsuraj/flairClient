<template>
  <widget title="AGS Helper">
    <template v-slot:body>
      <mdb-container fluid></mdb-container>
    </template>
  </widget>
</template>

<script>
import { mdbContainer } from "mdbvue";
import { AGENT_STATES } from "@/defines.js";
import Widget from "@/components/agc/Widget";

export default {
  name: "DgftHelper",
  components: {
    Widget,
    mdbContainer
  },
  mounted() {},
  props: {},

  data() {
    return {
      showWidget: false
    };
  },

  computed: {
    inboundCallList() {
      return this.$store.getters.getInboundCallList;
    },
    agentState() {
      return this.$store.getters["getAgentState"];
    }
  },

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget;
    }
  },
  watch: {
    inboundCallList(newInCallList, oldInCallList) {
      if (newInCallList.length > oldInCallList.length) {
        console.log("Dgfthelper/watch(allCalls): call list length increased");
        //if the call list increases, fetch the screenpop url for the latest call
        this.$store.dispatch(
          "updateDgftCrmUrl",
          newInCallList[newInCallList.length]
        );
      } else if (newInCallList.length < oldInCallList.length) {
        console.log("Dgfthelper/watch(allCalls): call list length decreased");
      } else {
        console.log("Dgfthelper/watch(allCalls): call list reamined the same");
      }
    },
    agentState(newAgentState) {
      if (newAgentState === AGENT_STATES.READY) {
        this.$store.dispatch("initializeDgftCrmUrl");
      }
    }
  }
};
</script>

