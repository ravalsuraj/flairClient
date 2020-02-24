<template>
  <mdb-container fluid :style="{ height: height }">
    <mdb-card class="mb-0" :class="{ 'h-100': true && showWidget }" style="border-radius:10px">
      <mdb-card-header :class="color" style="border-radius:5px 5px 0 0">
        <strong>{{ title }}</strong>

        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
        <div class="float-right pr-5">
          <slot name="toolbar"></slot>
        </div>
      </mdb-card-header>
      <mdb-card-body class="px-1" v-show-slide="showWidget" :class="{ 'p-0': !showWidget }">
        <slot name="body"></slot>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import { mdbContainer, mdbCard, mdbCardBody, mdbCardHeader, mdbIcon } from "mdbvue";

export default {
  name: "Widget",
  components: {
    mdbContainer,

    mdbCard,
    mdbCardBody,
    mdbCardHeader,

    mdbIcon
  },
  mounted() {},
  props: {
    title: String,
    color: {
      type: String,
      default: "mdb-color text-white"
    },
    height: {
      type: String,
      default: ""
    },
    fillHeight: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showWidget: true
    };
  },

  computed: {},

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget;
    }
  }
};
</script>
