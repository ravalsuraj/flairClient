<template>
  <v-container fluid class="d-flex p-0 justify-content-between">
    <span>{{chatterName}}</span>
    <a>
      <v-icon dark small right class="float-right" @click.native="onCloseBtnClick">mdi-close</v-icon>
      <v-icon
        dark
        small
        right
        class="float-right"
        @click.native="onMinimizeBtnClick"
      >{{minimized?'mdi-menu':'mdi-minus'}}</v-icon>
    </a>
  </v-container>
</template>

<script>
export default {
  name: "ChatHeader",
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
