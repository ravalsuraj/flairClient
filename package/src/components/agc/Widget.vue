<template>
  <mdb-container fluid>
    <mdb-card class="mb-0">
      <mdb-card-header :class="color">
        <strong>{{title}}</strong>
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <mdb-card-body class="px-1" v-show-slide="showWidget" :class="{'p-0': !showWidget}">
        <slot name="body"></slot>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
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
} from 'mdbvue'
import { AGENT_STATES, CALL_STATES } from '@/defines.js'

export default {
  name: 'Widget',
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
  props: {
    title: String,
    color: {
      type: String,
      default: 'mdb-color text-white'
    }
  },

  data() {
    return {
      showWidget: true
    }
  },

  computed: {},

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    }
  }
}
</script>