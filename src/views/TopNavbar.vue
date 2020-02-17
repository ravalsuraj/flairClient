<template>
  <mdb-navbar
    class="special-color white-text flexible-navbar fl_topNav"
    position="top"
    navIconClass="white-text"
    animation="1"
  >
    <mdb-navbar-brand href="/" target="_blank">
      <div class="light-color" style="opacity:1">
        <img
          src="@/assets/flair_logo_white.png"
          class="mx-5"
          alt="Responsive image"
          style="width: 75px; opacity:1 !important"
        />
      </div>
    </mdb-navbar-brand>
    <mdb-navbar-nav right>
      <!-- <span class="fl_navbar_item">
        <mdb-btn
         class="light-blue"
  
          @click.native="showOutboundDialerModal = true"
        >Place Call</mdb-btn>
        <mdb-modal
          size="sm"
          v-if="showOutboundDialerModal"
          @close="showOutboundDialerModal = false"
        >
          <mdb-modal-header class="black-text">
            <mdb-modal-title>Make Call</mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body>
            <outbound-dialer @close-self="showOutboundDialerModal = false"></outbound-dialer>
          </mdb-modal-body>
        </mdb-modal>
      </span>-->
      <agent-state-control></agent-state-control>
      <!-- <span class="fl_navbar_item">
        <agent-state-control></agent-state-control>
      </span> -->
      <span class="fl_navbar_item">
        <agent-profile></agent-profile>
      </span>
    </mdb-navbar-nav>
  </mdb-navbar>
</template>


<script>
import AgentStateControl from "@/widgets/AgentControl/AgentStateControl.vue";
import AgentProfile from "@/widgets/AgentControl/AgentProfile.vue";
import { mdbNavbar, mdbNavbarBrand, mdbNavbarNav } from "mdbvue";
export default {
  name: "TopNavbar",
  components: {
    AgentProfile,
    AgentStateControl,
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavbarNav
  },

  props: {},

  data() {
    return {
      showOutboundDialerModal: false
    };
  },
  methods: {}
};
</script>

<style>

.fl_navbar_item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
  min-width: 140px;
}

/* .fl_navbar_item::after {
  content: ' ';
  margin: 3px -85px;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #2f3336;
  box-shadow: 0 0 6px 0px rgba(255, 255, 255, 0.1);
} */
.divider-vertical {
  height: 50px;
  margin: 0 9px;
  border-left: 1px solid #f2f2f2;
  border-right: 1px solid #fff;
}
.fl_topNav::after {
  content: "";
  line-height: 0;
  font-size: 0;
  width: 0;
  height: 0;
  border-top: 45px solid #37474f;
  border-bottom: 45px solid transparent;
  border-left: 0px solid transparent;
  border-right: 50px solid transparent;
  position: absolute;
  top: 0;
  right: -50px;
}
.navbar-login {
  width: 305px;
  padding: 10px;
  padding-bottom: 0px;
}

.navbar-login-session {
  padding: 10px;
  padding-bottom: 0px;
  padding-top: 0px;
}

.icon-size {
  font-size: 87px;
}

.navbar-light .navbar-brand {
  margin-left: 15px;
  color: #2196f3 !important;
  font-weight: bolder;
}
main {
  background-color: #ededee;
}

.flexible-navbar {
  user-select: none;
  transition: padding-left 0.5s;
  padding-left: 0;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

@media (max-width: 1199.98px) {
  .sidebar-fixed {
    display: none;
  }
  .flexible-content {
    padding-left: 0;
  }
  .flexible-navbar {
    padding-left: 10px;
  }
}
</style>
