<template>
  <mdb-container fluid>
    <mdb-card class="mb-0">
      <mdb-card-header color="special-color text-white">
        Call Details
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <mdb-card-body class="p-0 m-0" v-show-slide="showWidget">
        <!-- <mdb-card-text><strong>Caller Details</strong></mdb-card-text> -->
        <mdb-container>
          <mdb-row>
            <mdb-col col="lg-12 mt-2">
              <dl class="row mb-1 no-gutters fl_dl" v-for="element in callerData">
                <dt class="col-sm-6 fl_dt">{{element.key}}</dt>
                <dd class="col-sm-6 fl_dd">{{element.value.length>0?element.value : "-"}}</dd>
              </dl>
            </mdb-col>
          </mdb-row>
          <hr>
          <mdb-row>
            <mdb-col col="lg-12">
              <dl class="row mb-1 no-gutters fl_dl" v-for="element in uuiElements">
                <dt class="col-sm-6 fl_dt">{{element.key}}</dt>
                <dd class="col-sm-6 fl_dd">{{element.value.length>0?element.value : "-"}}</dd>
              </dl>
            </mdb-col>
          </mdb-row>
        </mdb-container>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import {
  mdbRow,
  mdbCol,
  mdbContainer,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbIcon,
  mdbTbl,
  mdbTblHead,
  mdbTblBody,
  mdbListGroup,
  mdbListGroupItem,
  mdbBadge,
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter
} from 'mdbvue'
export default {
  name: 'CallerDetails',
  components: {
    mdbRow,
    mdbCol,
    mdbContainer,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbIcon,
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbListGroup,
    mdbListGroupItem,
    mdbBadge,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter
  },
  props: {},
  data() {
    return { showWidget: true }
  },
  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    }
  },
  computed: {
    uuiLabels() {
      return this.$store.state.uui.labels
    },
    callerData() {
      return this.$store.getters.getCallerData
    },
    uuiElements() {
      return this.$store.getters.getUui
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fl_dd,
.fl_dt {
  height: 10px;
}
</style>
