<template>
  <mdb-navbar
    class="special-color white-text flexible-navbar fl_topNav"
    position="top"
    navIconClass="white-text"
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
    <!-- <mdb-navbar-toggler>
    </mdb-navbar-toggler>-->
    <!-- <mdb-navbar-nav left>
      <call-control></call-control>
    </mdb-navbar-nav>-->
    <mdb-navbar-nav right class="pr-5">
      <!-- <div class="light-color" style="opacity:1">
        <img
          src="@/assets/flair_logo_white.png"
          class="mx-5"
          alt="Responsive image"
          style="width: 75px; opacity:1 !important"
        />
      </div>-->
      <mdb-btn
        color="default"
        class="mr-5"
        @click.native="showOutboundDialerModal = true"
      >Place Call</mdb-btn>
      <mdb-modal size="sm" v-if="showOutboundDialerModal" @close="showOutboundDialerModal = false">
        <mdb-modal-header  class="black-text">
          <mdb-modal-title>Consult Call</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <outbound-dialer></outbound-dialer>
        </mdb-modal-body>
      </mdb-modal>

      <!-- <mdb-modal
        frame
        removeBackdrop
        position="top"
        v-if="showOutboundDialerModal"
        @close="showOutboundDialerModal = false"
      >
        <mdb-modal-body class="text-center">
          <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit nisi quo provident fugiat reprehenderit nostrum quos...</span>
          <mdb-btn color="secondary" @click.native="showOutboundDialerModal = false">Close</mdb-btn>
          <mdb-btn color="primary">Save changes</mdb-btn>
        </mdb-modal-body>
      </mdb-modal>-->
      <agent-control></agent-control>
    </mdb-navbar-nav>
  </mdb-navbar>
</template>


<script>
import AgentControl from '@/widgets/AgentControl/AgentControl.vue'
import OutboundDialer from '@/widgets/Dialer/OutboundDialer.vue'
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbCard,
  mdbCardHeader,
  mdbCardText,
  mdbNavbar,
  mdbNavbarBrand,
  mdbNavItem,
  mdbNavbarNav,
  mdbNavbarToggler,
  mdbBtn,
  mdbIcon,
  mdbListGroup,
  mdbListGroupItem,
  mdbCardBody,
  mdbFooter,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  waves
} from 'mdbvue'
export default {
  name: 'TopNavbar',
  components: {
    AgentControl,
    OutboundDialer,
    mdbRow,
    mdbCol,
    mdbContainer,
    mdbCard,
    mdbCardHeader,
    mdbCardText,
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbBtn,
    mdbIcon,
    mdbListGroup,
    mdbListGroupItem,
    mdbCardBody,
    mdbFooter,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    waves,
    ftr: mdbFooter
  },

  props: {},

  data() {
    return {
      showOutboundDialerModal: false
    }
  },
  methods: {
    toggleDevMode() {
      this.$store.commit('TOGGLE_DEV_MODE')
    }
  }
}
</script>

<style>
.fl_topNav {
  /*width: fit-content;*/
}
.fl_topNav::after {
  content: '';
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
