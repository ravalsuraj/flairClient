<template>
  <!-- <mdb-btn
    class="btn-circle btn-lg"
    :class="{ fl_disabledWidget: false }"
    :color="showSideNavbar ? 'cyan' : 'mdb-color'"
    @click.native="toggleChatSidebar"
    flat
  >
    
    <mdb-icon
      icon="phone"
      style="font-size:1em"
      class="white-text fl_rotating_icon"
      :class="{ active: showSideNavbar }"
    />
  </mdb-btn>-->
  <a @click="toggleChatSidebar">
    <mdb-icon
      icon="comment-alt"
      style="font-size:1.5em"
      class="white-text"
      :class="{ active: showSideNavbar }"
    />
  </a>
</template>
<script>
import { mdbIcon } from "mdbvue";

export default {
  name: "SideNavbar-Toggle",
  components: {
    // mdbBtn,
    mdbIcon,
    
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