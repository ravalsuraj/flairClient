<template>
  <mdb-card class="agc-chat-window d-flex flex-column z-depth-3 rounded" :style="style_width">
    <div class="agc-chat-header cyan py-3">
      <chat-header
        @close="toggleChatWindow"
        @minimize="toggleChatMinimized"
        :minimized="minimized"
        :chatter-name="chatterName"
        :interaction-history="interactionHistory"
      ></chat-header>
    </div>
    <zoom-y-transition>
      <div v-if="isChatActive" class="d-flex flex-column h-100 flex-grow-1 p-3">
        <chat-body :chatId="chatId"></chat-body>
        <!-- <hr class="agc-separator" /> -->
        <div class="interactive-response" v-if="isLastMessageInteractive">
          <chip-response v-if="isLastMessageInteractive" :message="lastMessage"></chip-response>
        </div>

        <user-entry :chatId="chatId"></user-entry>
      </div>
      <div v-if="isChatRequested" class="d-flex flex-column mt-3 text-center">
        <div class="h3 pb-5">Chat Requested from {{chatterName}}</div>

        <!-- <mdb-breadcrumb>
          <mdb-breadcrumb-item>
            <a href="#">{{interaction}}</a>
          </mdb-breadcrumb-item>
        </mdb-breadcrumb>-->
        <h3 class="pb-3">Interaction History</h3>
        <div style="height:180px;overflow:auto">
          <mdb-list-group class="pb-3">
            <mdb-list-group-item
              style="text-align: left !important;"
              v-for="(interaction, i) in interactionHistory"
              :key="i"
            >{{i+'. '+ interaction}}</mdb-list-group-item>
          </mdb-list-group>
        </div>

        <mdb-container style>
          <mdb-row class="mx-3 my-4">
            <mdb-col col="6">
              <mdb-btn
                class="btn-block"
                color="success"
                @click.native="onAcceptChatButtonClicked"
              >Accept</mdb-btn>
            </mdb-col>
            <mdb-col col="6">
              <mdb-btn
                class="btn-block"
                color="danger"
                @click.native="onRejectChatButtonClicked"
              >Reject</mdb-btn>
            </mdb-col>
          </mdb-row>
        </mdb-container>
      </div>
    </zoom-y-transition>
  </mdb-card>
</template>

<script>
import { ZoomYTransition } from "vue2-transitions";
import ChatHeader from "./ChatHeader.vue";
import ChatBody from "./ChatBody.vue";
import UserEntry from "./UserEntry.vue";
import ChipResponse from "./../Responses/ChipResponse";
import { CHAT_STATES } from "@/defines";
import {
  mdbCard,
  mdbCardHeader,
  mdbCardBody,
  mdbBtn,
  mdbIcon,
  mdbListGroup,
  mdbListGroupItem,
  mdbContainer,
  mdbRow,
  mdbCol
} from "mdbvue";

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
    ZoomYTransition,
    mdbCard,
    mdbCardHeader,
    mdbCardBody,
    mdbBtn,
    mdbIcon,
    mdbListGroup,
    mdbListGroupItem,
    mdbContainer,
    mdbRow,
    mdbCol
  },
  methods: {
    toggleChatWindow() {
      console.log("toggling window for chatId=" + this.chatId);
      this.$store.dispatch("toggleChatWindow", this.chatId);
    },
    toggleChatMinimized() {
      this.minimized = !this.minimized;
    },
    onAcceptChatButtonClicked() {
      this.$store.dispatch("acceptChatRequest", this.chatId);
    },
    onRejectChatButtonClicked() {
      this.$store.dispatch("rejectChatRequest", this.chatId);
    }
  },
  computed: {
    style_width() {
      return "width: " + this.width + "px";
    },
    chatSession() {
      return this.$store.getters.getChatSessionById(this.chatId);
    },
    interactionHistory() {
      return this.chatSession.interactionHistory;
    },
    isChatActive() {
      console.log("thischatstate=", this.chatSession.state);
      console.log("CHAT_STATES>ACTIVE=", CHAT_STATES.ACTIVE);
      return this.chatSession.state == CHAT_STATES.ACTIVE;
    },
    isChatRequested() {
      return this.chatSession.state == CHAT_STATES.REQUESTED;
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
  min-height: 400px;
  margin-right: 30px;
  margin-bottom: 30px;
  font-size: 1.3em;
  transition: height 5s;
}
.agc-chat-window.minimized {
  height: unset;
}

.agc-chat-window.rounded {
  border-radius: 10px !important;
}

.agc-chat-window.rounded .agc-chat-header {
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
}

.agc-chat-header {
  /* background-color: rgb(98, 60, 234); */
  color: white;
}
.agc-separator {
  border: 1px solid #f0f0f0;
}
</style>
