<template>
  <mdb-container fluid>
    <mdb-card class="mb-0">
      <mdb-card-header color="special-color text-white">
        Menu Traversal
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <mdb-card-body class="p-0 m-0" v-show-slide="showWidget">
        <!-- <mdb-card-text><strong>Menu Traversal</strong></mdb-card-text> -->
        <!-- <mdb-container> -->
        <mdb-row class="no-gutters">
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
                  <td>28/01/19 10:02:30</td>
                  <td>Lanaguage Selection</td>
                </tr>
                <tr>
                  <td>28/01/19 10:02:30</td>
                  <td>Main Menu</td>
                </tr>
                <tr>
                  <td>28/01/19 10:02:38</td>
                  <td>Account Services</td>
                </tr>
                <tr>
                  <td>28/01/19 10:02:47</td>
                  <td>Balance Inquiry</td>
                </tr>
                <tr>
                  <td>28/01/19 10:03:05</td>
                  <td>Main Menu</td>
                </tr>
                <tr>
                  <td>28/01/19 10:03:11</td>
                  <td>PIN Generation</td>
                </tr>
                <tr>
                  <td>28/01/19 10:03:21</td>
                  <td>Self-Validation</td>
                </tr>
              </mdb-tbl-body>
            </mdb-tbl>
          </mdb-col>
        </mdb-row>
        <!-- </mdb-container> -->
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
} from "mdbvue";
export default {
  name: "MenuTraversal",
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
    return {
      showWidget: true,
      callerName: "John Doe",
      callerRMN: "+919876512345",
      callerAccountNo: "1234512345",
      callerTransferReason: "TPIN Generate",
      callerLanguage: "English"
    };
  },
  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget;
    }
  }
};
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
