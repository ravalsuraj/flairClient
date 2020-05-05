C<template>
  <div class="p-1 d-flex">
    <v-textarea
      class="px-2"
      no-resize
      auto-grow
      outlined
      dense
      hide-details
      row-height="1"
      name="user-entry-text"
      v-model="typedMessage"
      @keydown.enter="handleEnter"
      @keydown.enter.prevent
    ></v-textarea>
    <!-- <v-btn rounded class="white--text info-color">o</v-btn> -->
    <v-btn class="ma-2" tile color="teal" icon @click.native="sendMessage">
      <v-icon small>mdi-send</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "UserEntry",
  props: {
    chatId: String
  },
  data() {
    return {
      typedMessage: null
    };
  },
  methods: {
    handleEnter(e) {
      if (e.shiftKey) return console.log("New line", e);
      // else {
      // }
      this.sendMessage();
    },
    sendMessage() {
      if (this.typedMessage && this.typedMessage.length > 0) {
        const newMessage = {
          type: "text",
          chatId: this.chatId,
          isInteractive: false,
          content: {
            text: this.typedMessage
          },
          self: true
        };
        this.$store.dispatch("addMessage", [this.chatId, newMessage]);
        this.typedMessage = "";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-text-field input {
  font-size: 0.2em;
}
</style>
