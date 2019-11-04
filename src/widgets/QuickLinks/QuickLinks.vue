<template>
  <mdb-container fluid>
    <mdb-card class="mb-0">
      <mdb-card-header color="special-color">
        Quick Links
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <mdb-card-body class="p-0" v-show-slide="showWidget" :class="{'p-0': !showWidget}">
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action">IVR Reports</a>
          <a href="#" class="list-group-item list-group-item-action">CMS Reports</a>
          <a href="#" class="list-group-item list-group-item-action">Finnacle UI</a>
        </div>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbInput,
  mdbIcon
} from "mdbvue";

import { AGENT_STATES, CALL_STATES } from "@/defines.js";

export default {
  name: "QuickLinks",
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbInput,
    mdbIcon
  },
  mounted() {},
  props: {
    msg: String
  },

  data() {
    return {
      showWidget: true
    };
  },

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
