<template>
  <widget title="Menu Traversal">
    <template v-slot:body>
      <mdb-row class="no-gutters" v-if="isCurrentCallActive">
        <mdb-col>
          <mdb-tbl sm bordered scrollY maxHeight="150px">
            <mdb-tbl-head color="light-blue lighten-5">
              <tr>
                <th>Time</th>
                <th>Menu</th>
              </tr>
            </mdb-tbl-head>
            <mdb-tbl-body v-for="callDetail in callTraversal" :key=callDetail.Time>
              <tr>
                <td>{{callDetail.Time}}</td>
                <td>{{callDetail.MenuName}}</td>
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
  mdbTbl,
  mdbTblHead,
  mdbTblBody
} from "mdbvue";
import Widget from "@/components/agc/Widget";
import { CALL_STATES } from "@/defines.js";

export default {
  name: "MenuTraversal",
  components: {
    Widget,
    mdbRow,
    mdbCol,
    mdbContainer,

    mdbTbl,
    mdbTblHead,
    mdbTblBody
  },
  props: {
    callTraversal:JSON,
    cli:String
  },
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
    },
    async selectcallTraversal(){
      console.log('hi traversal')
      let resp = await this.$store.dispatch("selectcallTraversal");
      console.log(resp)
      this.callTraversal=resp
      console.log(this.callTraversal)
    },
  },
  computed: {
     myCall() {
      //let index = this.$store.getters.getCallIndex("1234");

      let myCall = this.$store.getters.getCallByIndex(0);
      if (myCall) {
        return myCall;
      } else {
        return null;
      }
    },
     isCurrentCallActive() {
      return (
        this.currentCallState === CALL_STATES.TALKING ||
        this.currentCallState === CALL_STATES.RINGING ||
        this.currentCallState === CALL_STATES.HELD)
    },

    currentCallState() {
      if (this.myCall) {
        return this.myCall.status;
      } else {
        return null;
      }
    }
  },

  watch: {
    currentCallState(newState, oldState) {
      console.log("call state travarsal changed from:" + oldState + " to " + newState);
      if(newState !==null){
           if(newState===CALL_STATES.RINGING){
              this.cli=this.myCall.callingAddress
              this.selectcallTraversal()
          }
      }
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
