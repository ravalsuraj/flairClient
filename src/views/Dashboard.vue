
<template>
  <mdb-container fluid class="mx-2 px-0 pt-2 d-flex flex-fill flex-column">
    <mdb-row class="my-3 mx-0 call-drawer-container">
      <mdb-col col="12" class="mx-0 px-0">
        <call-drawer class="mx-0"></call-drawer>
      </mdb-col>
    </mdb-row>
    <hr />
    <mdb-row class="mx-0 d-flex flex-fill">
      <Carousel>
        <slide>
          <mdb-col
            :lg="leftComponentWidth"
            md="12"
            sm="12"
            class="mb-1 px-0 mx-0"
            v-if="leftComponentWidgets.length>0"
          >
            <draggable
              :list="leftComponentWidgets"
              class="dragArea flex-fill"
              ghostClass="ghost-component"
              chosenClass="chosen-component"
              animation="150"
              dragClass="dragged-component"
              filter=".card-body"
              :preventOnFilter="false"
            >
              <transition-group name>
                <component
                  v-for="component in leftComponentWidgets"
                  :is="component.name"
                  :key="component.name"
                  class="fl_widget"
                ></component>
              </transition-group>
            </draggable>
          </mdb-col>
        </slide>
        <slide>
          <mdb-col
            :lg="middleComponentWidth"
            md="12"
            sm="12"
            class="mb-1 px-0 mx-0 h-100"
            v-if="middleComponentWidgets.length>0"
          >
            <transition-group name>
              <component
                v-for="component in middleComponentWidgets"
                :is="component.name"
                :key="component.name"
                class="fl_widget"
              ></component>
            </transition-group>
          </mdb-col>
        </slide>
        <slide>
          <mdb-col
            :lg="rightComponentWidth"
            md="12"
            sm="12"
            class="mb-1 px-0 mx-0"
            v-if="rightComponentWidgets.length>0"
          >
            <draggable
              :list="rightComponentWidgets"
              class="dragArea"
              ghostClass="ghost-component"
              chosenClass="chosen-component"
              animation="150"
              dragClass="dragged-component"
              filter=".card-body"
              :preventOnFilter="false"
            >
              <transition-group name>
                <component
                  v-for="component in rightComponentWidgets"
                  :is="component.name"
                  :key="component.name"
                  class="fl_widget"
                ></component>
              </transition-group>
            </draggable>
          </mdb-col>
        </slide>
      </Carousel>
    </mdb-row>
  </mdb-container>
</template>

<script>
/* eslint-disable no-unused-vars */
import draggable from "vuedraggable";
import { Carousel, Slide } from "vue-carousel";
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbIcon,
  mdbTbl,
  mdbInput
} from "mdbvue";
import CallDrawer from "@/views/CallDrawer.vue";
import ConsultDialer from "@/widgets/Dialer/ConsultDialer.vue";
import CallDisposition from "@/widgets/CallDisposition/CallDisposition.vue";

import CallHistory from "@/widgets/CallHistory/CallHistory.vue";
import CallDetails from "@/widgets/CallDetails/CallDetails.vue";
import MenuTraversal from "@/widgets/MenuTraversal/MenuTraversal.vue";

import AgentCallStatistics from "@/widgets/AgentCallStatistics/AgentCallStatistics.vue";

import DgftCrmFrame from "@/widgets/DGFT/DgftCrmFrame.vue";

import BaseCrmFrame from "@/widgets/BaseCrmFrame/BaseCrmFrame.vue";

import QuickLinks from "@/widgets/QuickLinks/QuickLinks.vue";

import SmsHelper from "@/widgets/SmsHelper/SmsHelper.vue";
import QuessCrmFrame from "@/widgets/Quess/QuessCrmFrame.vue";
import QuessHelper from "@/widgets/Quess/QuessHelper.vue";

export default {
  name: "Dashboard",
  components: {
    draggable,
    ConsultDialer,
    DgftCrmFrame,
    QuickLinks,
    CallDisposition,
    AgentCallStatistics,
    MenuTraversal,
    BaseCrmFrame,
    CallDetails,
    CallHistory,
    SmsHelper,
    QuessCrmFrame,
    QuessHelper,
    CallDrawer,
    Carousel,
    Slide,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbIcon,
    mdbTbl,
    mdbInput
  },
  data() {
    return {
      custName: ""
    };
  },
  mounted() {
    //this.preventRefresh();
  },
  methods: {
    preventRefresh() {
      window.addEventListener("beforeunload", function(e) {
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = "";
      });
    }
  },
  computed: {
    config() {
      return this.$store.getters["session/getConfig"];
    },
    myGhost() {
      return { "my-ghost": true };
    },
    leftComponentWidgets: {
      get() {
        return this.config.leftComponents.widgets;
      }
    },
    leftComponentWidth: {
      get() {
        return this.config.leftComponents.width;
      }
    },
    middleComponentWidgets: {
      get() {
        return this.config.middleComponents.widgets;
      }
    },
    middleComponentWidth: {
      get() {
        return this.config.middleComponents.width;
      }
    },

    rightComponentWidgets: {
      get() {
        return this.config.rightComponents.widgets;
      }
    },

    rightComponentWidth: {
      get() {
        return this.config.rightComponents.width;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ghost-component {
  opacity: 0;
  cursor: move;
}
/* .chosen-component {
} */

.dragged-component {
  opacity: 1 !important;
}
.call-drawer-container {
  flex: unset;
}
</style>
