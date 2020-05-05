<template>
  <v-card
    :width="width"
    class="agc-chat-window d-flex flex-column"
    :class="{ rounded: $vuetify.breakpoint.smAndUp, minimized:minimized }"
  >
    <v-card-title class="agc-chat-header info-color py-3">
      <chat-header
        @close="toggleChatWindow"
        @minimize="toggleChatMinimized"
        :minimized="minimized"
        :chatter-name="chatterName"
      ></chat-header>
    </v-card-title>
    <zoom-y-transition>
      <div v-if="!minimized" class="d-flex flex-column h-100">
        <chat-body :chatId="chatId"></chat-body>
        <hr class="agc-separator" />
        <div class="interactive-response" v-if="isLastMessageInteractive">
          <chip-response v-if="isLastMessageInteractive" :message="lastMessage"></chip-response>
        </div>
        <user-entry :chatId="chatId"></user-entry>
      </div>
    </zoom-y-transition>
  </v-card>
</template>

<script>
import { ZoomYTransition } from "vue2-transitions";
import ChatHeader from "./ChatHeader.vue";
import ChatBody from "./ChatBody.vue";
import UserEntry from "./UserEntry.vue";
import ChipResponse from "./Responses/ChipResponse";

export default {
  name: "ChatWindow",
  props: {
    width: Number,
    height: Number,
    chatId: String
  },
  data() {
    return {
      minimized: false
    };
  },
  components: {
    ChatHeader,
    ChatBody,
    UserEntry,
    ChipResponse,
    ZoomYTransition
  },
  methods: {
    toggleChatWindow() {
      console.log("toggling window for chatId=" + this.chatId);
      this.$store.dispatch("toggleChatWindow", this.chatId);
    },
    toggleChatMinimized() {
      this.minimized = !this.minimized;
    }
  },
  computed: {
    chatSession() {
      return this.$store.getters.getChatSessionById(this.chatId);
    },
    chatterName() {
      return (
        this.chatSession.participant.firstName +
        " " +
        this.chatSession.participant.lastName
      );
    },
    messageList() {
      return this.$store.getters.getMessageList(this.chatId);
    },
    lastMessage() {
      if (this.messageList.length > 0) {
        return this.messageList[this.messageList.length - 1];
      } else {
        return null;
      }
    },
    isLastMessageInteractive() {
      if (this.messageList.length > 0) {
        return this.lastMessage.isInteractive;
      } else {
        return false;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.agc-chat-window {
  margin: auto;
  height: 400px;
  margin-right: 40px;
  margin-bottom: 30px;
  font-size: 1.3em;
  transition: height 5s;
}
.agc-chat-window.minimized {
  height: unset;
}

.agc-chat-window.rounded {
  border-radius: 5px !important;
}

.agc-chat-header {
  /* background-color: rgb(98, 60, 234); */
  color: white;
}
.agc-separator {
  border: 1px solid #f0f0f0;
}
</style>
