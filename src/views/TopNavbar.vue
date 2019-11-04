<template>
  <mdb-navbar
    class="special-color white-text flexible-navbar"
    position="top"
    scrolling
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
    <mdb-navbar-nav left>
      <call-control></call-control>
    </mdb-navbar-nav>
    <mdb-navbar-nav right class="pr-5">
      <agent-control></agent-control>
    </mdb-navbar-nav>
  </mdb-navbar>
</template>
<style>
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
  transition: padding-left 0.5s;
  padding-left: 0;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

.sidebar-fixed {
  left: 0;
  top: 0;
  height: 100vh;
  width: 170px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  z-index: 1050;
  background-color: #fff;
  padding: 0rem;
  padding-top: 0;
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

<script>
import AgentControl from '@/widgets/AgentControl/AgentControl.vue'
import CallControl from '@/widgets/CallControl/CallControl.vue'
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
  waves
} from 'mdbvue'
export default {
  name: 'TopNavbar',
  components: {
    AgentControl,
    CallControl,
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
    waves,
    ftr: mdbFooter
  },

  props: {},

  data() {
    return {}
  },
  methods: {
    toggleDevMode() {
      this.$store.commit('TOGGLE_DEV_MODE')
    }
  }
}
</script>
