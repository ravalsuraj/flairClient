<template>
  <widget title="Quick Links">
    <template v-slot:body>
      <div class="list-group px-3">
        <!--target=_blank causes the links to open in a new tab-->
        <!-- <a
          href="http://www.google.com"
          target="_blank"
          class="list-group-item list-group-item-action"
        >Google</a>-->
        <a
          href="http://login.salesforce.com"
          class="list-group-item list-group-item-action my-2 light-blue lighten-4 text-black"
          target="_blank"
        >
          <strong>Salesforce</strong>
        </a>
        <a
          href="#"
          class="list-group-item list-group-item-action light-green lighten-4 text-black"
          target="_blank"
        >
          <strong>Finnacle</strong>
        </a>
      </div>
    </template>
  </widget>
</template>

<script>

import Widget from '@/components/agc/Widget'
export default {
  name: 'QuickLinks',
  components: {
    Widget,

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
