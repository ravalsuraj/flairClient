<template>
  <scale-transition>
    <aside id="sidebar" class="mdb-color" v-show="showChatSideBar">
      <!-- <header class="sidebar-header">
      <span="#" class="brand-logo">Brand Logo</span=>
      </header>-->
      <main class="sidebar-body">
        <ul>
          <li
            class="chat-item"
            v-for="chat in chatSessions"
            :key="chat.id"
            @click="toggleChatWindow(chat.chatId)"
          >
            <span class="md-avatar rounded-circle chat-avatar white">{{chat.participant.initials}}</span>
            <span class="chat-link">{{chat.participant.firstName+' '+chat.participant.lastName}}</span>
          </li>
        </ul>
      </main>
    </aside>
  </scale-transition>
</template>

<script>
import {} from "mdbvue";
import { ScaleTransition } from "vue2-transitions";
export default {
  name: "Chatbar",
  components: { ScaleTransition },

  props: {},

  data() {
    return {
      slimCollapsed: true
    };
  },
  methods: {
    toggleChatWindow(chatId) {
      this.$store.dispatch("toggleChatWindow", chatId);
    }
  },
  computed: {
    showChatSideBar() {
      return this.$store.getters.getChatSidebarState;
    },
    chatSessions() {
      return this.$store.getters.getChatSessions;
    }
  },
  
};
</script>

<style>
#sidebar {
  padding: 10px 0;
  user-select: none;
  position: absolute;
  right: 10px;
  bottom: 30px;
  width: 200px;
  visibility: visible;
  opacity: 1;
  -webkit-transform: translateX(0);
  transform: translateX(0);
  -webkit-transition: 250ms ease-in;
  transition: 250ms ease-in;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

#sidebar .sidebar-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 10px 20px;
}

#sidebar .sidebar-header .brand-logo {
  font-size: 1.5em;
  -webkit-transform: translateX(0);
  transform: translateX(0);
  -webkit-transition: 250ms ease-in;
  transition: 250ms ease-in;
  visibility: visible;
}
.sidebar-body ul {
  padding-left: 0;
}
.sidebar-body .chat-item {
  padding: 20px 20px;
  cursor: pointer;
  -webkit-transition: 400ms all ease-in-out;
  transition: 400ms all ease-in-out;
  -webkit-transform: translateX(0);
  transform: translateX(0);
  list-style: none;
}

.sidebar-body .chat-item:hover {
  background-color: #7280ce;
}
.chat-link {
  color: white;
  font-size: 1.2em;
}
.chat-avatar {
  font-size: 1.3em;
  padding: 10px;
  height: 30px;
  margin-right: 10px;
}
@-webkit-keyframes sidebarAnim {
  0% {
    width: 220px;
    opacity: 1;
    -webkit-transform: translateX(0);
    transform: translateX(0);
    visibility: visible;
  }
  50% {
    width: 220px;
  }
  100% {
    width: 0;
    opacity: 0;
    -webkit-transform: translateX(-220px);
    transform: translateX(-220px);
    visibility: hidden;
  }
}

@keyframes sidebarAnim {
  0% {
    width: 220px;
    opacity: 1;
    -webkit-transform: translateX(0);
    transform: translateX(0);
    visibility: visible;
  }
  50% {
    width: 220px;
  }
  100% {
    width: 0;
    opacity: 0;
    -webkit-transform: translateX(-220px);
    transform: translateX(-220px);
    visibility: hidden;
  }
}
</style>
