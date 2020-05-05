<template>
  <section class="agc-chat-drawer d-flex justify-content-bottom">
    <div v-for="chat in chatSessions" :key="chat.chatId">
      <chat-window v-if="chat.show" :width="300" :height="400"  :chatId="chat.chatId"></chat-window>
    </div>
  </section>
</template>

<style></style>

<script>
// import _ from "lodash.debounce";
import ChatWindow from "@/components/chat/ChatWindow.vue";
// import { mdbRow, mdbCol, mdbContainer } from "mdbvue";
export default {
  name: "ChatDrawer",
  components: { ChatWindow },

  props: {},

  data() {
    return {};
  },
  methods: {},
  computed: {
    chatSessions() {
      return this.$store.getters.getChatSessions;
    }
  },
  watch: {}
};
</script>
<style scoped>
.agc-chat-drawer {
  /* position: absolute; */
    position: absolute;
  bottom: 0;
  right: 0;
}
</style>
