<template>
  <mdb-container fluid class="d-flex justify-content-between">
    <span>
      <strong>{{chatterName}}</strong>
    </span>
    <a>
      <mdb-icon
        dark
        small
        right
        class="float-right"
        @click.native="onCloseBtnClick"
        icon="window-minimize"
      ></mdb-icon>
    </a>
  </mdb-container>
</template>

<script>
import { mdbIcon, mdbContainer } from "mdbvue";
export default {
  name: "ChatHeader",
  components: {
    mdbIcon,
    mdbContainer
  },
  props: {
    minimized: Boolean,
    chatterName: String
  },
  methods: {
    onHeaderClick() {
      if (this.minimized) {
        this.$emit("minimize");
      }
    },
    onCloseBtnClick() {
      this.$emit("close");
    },
    onMinimizeBtnClick() {
      this.$emit("minimize");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.clickable {
  cursor: pointer;
}
</style>
