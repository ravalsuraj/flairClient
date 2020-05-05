<template>
  <div>
    <a @click="toggleChatSidebar">
      <mdb-icon
        icon="comment-alt"
        style="font-size:1.5em"
        class="white-text"
        :class="{ active: showSideNavbar }"
      />
    </a>
    <chatbar></chatbar>
  </div>
</template>
<script>
import { mdbIcon } from "mdbvue";
import Chatbar from "@/components/chat/Chatbar.vue";
export default {
  name: "Chatbar-Toggle",
  components: {
    Chatbar,
    mdbIcon
  },
  data() {
    return {
      showSideNavbar: false
    };
  },
  methods: {
    toggleChatSidebar() {
      this.$store.dispatch(
        "setChatSidebarState",
        !this.$store.getters.getChatSidebarState
      );
    }
  }
};
</script>