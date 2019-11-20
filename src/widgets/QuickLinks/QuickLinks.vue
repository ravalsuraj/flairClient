<template>
  <widget title="Quick Links">
    <template v-slot:body>
      <div class="list-group">
        <!--target=_blank causes the links to open in a new tab-->
        <a
          href="http://www.google.com"
          target="_blank"
          class="list-group-item list-group-item-action"
        >Google</a>
        <a href="#" class="list-group-item list-group-item-action">CMS Reports</a>
        <a href="#" class="list-group-item list-group-item-action">Finnacle UI</a>
      </div>
    </template>
  </widget>
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
import Widget from '@/components/agc/Widget'
export default {
  name: 'QuickLinks',
  components: {
    Widget,
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
    msg: String
  },

  data() {
    return {
      showWidget: true
    }
  },

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
