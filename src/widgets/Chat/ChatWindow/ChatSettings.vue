<template>
  <div class="agc-chat-settings d-flex align-items-center flex-column">
    <mdb-btn
      class="agc-chat-settings-toggler mx-auto"
      color="blue-grey"
      @click="showSettings = !showSettings"
    >Test</mdb-btn>
    <CollapseTransition>
      <mdb-container fluid v-if="showSettings">
        <mdb-row class="no-gutters">
          <mdb-col v-for="i in 4" :key="i">
            <mdb-btn block>Test</mdb-btn>
          </mdb-col>
        </mdb-row>
      </mdb-container>
    </CollapseTransition>
  </div>
</template>

<script>
import { mdbRow, mdbCol, mdbBtn, mdbContainer } from "mdbvue";
import { CollapseTransition } from "vue2-transitions";
export default {
  name: "ChatSettings",
  components: {
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbContainer,
    CollapseTransition
  },
  data() {
    return {
      showSettings: false
    };
  }
};
</script>


<style scoped>
.agc-chat-settings {
  position: absolute;
  bottom: 80px; 
}
.agc-chat-settings-toggler {
  border-radius: 28px 28px 0 0;
}
</style>