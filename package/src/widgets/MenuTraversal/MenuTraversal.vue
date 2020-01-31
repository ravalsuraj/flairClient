<template>
  <widget title="Menu Traversal">
    <template v-slot:body>
      <mdb-row class="no-gutters" v-if="isCallActive">
        <mdb-col>
          <mdb-tbl sm bordered scrollY maxHeight="150px">
            <mdb-tbl-head color="light-blue lighten-5">
              <tr>
                <th>Time</th>
                <th>Menu</th>
              </tr>
            </mdb-tbl-head>
            <mdb-tbl-body>
              <tr>
                <td>09/10/19 13:05:30</td>
                <td>Lanaguage Selection</td>
              </tr>
              <tr>
                <td>09/10/19 13:05:30</td>
                <td>Main Menu</td>
              </tr>
              <tr>
                <td>09/10/19 13:05:38</td>
                <td>Account Services</td>
              </tr>
              <tr>
                <td>09/10/19 13:05:47</td>
                <td>Balance Inquiry</td>
              </tr>
              <tr>
                <td>09/10/19 10:06:05</td>
                <td>Main Menu</td>
              </tr>
            </mdb-tbl-body>
          </mdb-tbl>
        </mdb-col>
      </mdb-row>
      <mdb-container fluid v-else class="p-4">
        <h4 class="grey-text">Waiting for call</h4>
      </mdb-container>
    </template>
  </widget>
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
import Widget from '@/components/agc/Widget'
import { CALL_STATES } from '@/defines.js'

export default {
  name: 'MenuTraversal',
  components: {
    Widget,
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
    return {
      showWidget: true,
      callerName: 'John Doe',
      callerRMN: '+919876512345',
      callerAccountNo: '1234512345',
      callerTransferReason: 'TPIN Generate',
      callerLanguage: 'English'
    }
  },
  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    }
  },
  computed: {
    isCallActive() {
      let callStatus = this.$store.getters.getCallStatus
      return (
        callStatus === CALL_STATES.TALKING ||
        callStatus === CALL_STATES.HELD ||
        callStatus === CALL_STATES.RINGING
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
th,
td {
  font-size: 1rem;
}
</style>
