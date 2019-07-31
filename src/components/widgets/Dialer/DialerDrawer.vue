<template>
  <!-- <mdb-card class="mb-0" color="special-color">
  <mdb-card-body class="p-2 mb-1">-->
  <div class="tabbed round">
    <ul>
      <li>Third tab</li>
    </ul>
  </div>

  <!-- </mdb-card-body>
  </mdb-card>-->
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbInput,
  mdbIcon
} from "mdbvue";
import { CALL_STATES, SOCKET_EVENTS } from "@/defines.js";

export default {
  name: "DialerDrawer",
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbInput,
    mdbIcon
  },
  mounted() {},
  props: {},

  data() {
    return {};
  },

  methods: {},
  computed: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fl_tab_dialerDrawer {
  position: fixed;

  height: 30px;
  width: 50px;
  background: blue;
}

.fl_iconGlow {
  -webkit-animation: glowing 1500ms infinite;
  -moz-animation: glowing 1500ms infinite;
  -o-animation: glowing 1500ms infinite;
  animation: glowing 1500ms infinite;
}
@-webkit-keyframes glowing {
  0% {
    background-color: #85d8a6;
    -webkit-box-shadow: 0 0 3px #85d8a6;
  }
  50% {
    background-color: #00c851;
    -webkit-box-shadow: 0 0 6px #00c851;
  }
  100% {
    background-color: #85d8a6;
    -webkit-box-shadow: 0 0 3px #85d8a6;
  }
}

@-moz-keyframes glowing {
  0% {
    background-color: #85d8a6;
    -moz-box-shadow: 0 0 3px #85d8a6;
  }
  50% {
    background-color: #00c851;
    -moz-box-shadow: 0 0 6px #00c851;
  }
  100% {
    background-color: #85d8a6;
    -moz-box-shadow: 0 0 3px #85d8a6;
  }
}

@-o-keyframes glowing {
  0% {
    background-color: #85d8a6;
    box-shadow: 0 0 3px #85d8a6;
  }
  50% {
    background-color: #00c851;
    box-shadow: 0 0 6px #00c851;
  }
  100% {
    background-color: #85d8a6;
    box-shadow: 0 0 3px #85d8a6;
  }
}

@keyframes glowing {
  0% {
    background-color: #85d8a6;
    box-shadow: 0 0 3px #85d8a6;
  }
  50% {
    background-color: #00c851;
    box-shadow: 0 0 6px #00c851;
  }
  100% {
    background-color: #85d8a6;
    box-shadow: 0 0 3px #85d8a6;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.tabbed {
  position: relative;
  top: 100px;
  /* width: 80%;

  margin: 0 auto;
  margin-bottom: 68px;
  overflow: hidden;
  transition: border 250ms ease; */
}
.tabbed ul {
  transform: rotate(180deg);
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  float: left;
  padding-left: 48px;
  list-style-type: none;
}
.tabbed ul * {
  margin: 0px;
  padding: 0px;
}
.tabbed ul li {
  display: block;
  float: right;
  padding: 10px 24px 8px;
  background-color: #fff;
  margin-right: 46px;
  z-index: 2;
  position: relative;
  cursor: pointer;
  color: #777;

  text-transform: uppercase;
  font: 600 13px/20px roboto, "Open Sans", Helvetica, sans-serif;

  transition: all 250ms ease;
}
.tabbed ul li:before,
.tabbed ul li:after {
  display: block;
  content: " ";
  position: absolute;
  top: 0;
  height: 100%;
  width: 44px;
  background-color: #fff;
  transition: all 250ms ease;
}
.tabbed ul li:before {
  right: -24px;
  transform: skew(30deg, 0deg);
  box-shadow: rgba(0, 0, 0, 0.1) 3px 2px 5px,
    inset rgba(255, 255, 255, 0.09) -1px 0;
}
.tabbed ul li:after {
  left: -24px;
  transform: skew(-30deg, 0deg);
  box-shadow: rgba(0, 0, 0, 0.1) -3px 2px 5px,
    inset rgba(255, 255, 255, 0.09) 1px 0;
}
.tabbed ul li:hover,
.tabbed ul li:hover:before,
.tabbed ul li:hover:after {
  background-color: #f4f7f9;
  color: #444;
}
.tabbed ul li.active {
  z-index: 3;
}
.tabbed ul li.active,
.tabbed ul li.active:before,
.tabbed ul li.active:after {
  background-color: #000;
  color: #fff;
}

/* Round Tabs */
.tabbed.round ul li {
  border-radius: 8px 8px 0 0;
}
.tabbed.round ul li:before {
  border-radius: 0 8px 0 0;
}
.tabbed.round ul li:after {
  border-radius: 8px 0 0 0;
}

/* Skins */
.tabbed[class*="skin-"] ul li {
  color: #fff;
  text-shadow: rgba(0, 0, 0, 0.1) 0 1px;
}
</style>
