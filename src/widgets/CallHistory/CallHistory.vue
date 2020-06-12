<template>
 <widget :title="'Call history: ' + cli">
    <template v-slot:body>
      
      <mdb-row class="no-gutters" v-if="isCallActive">
        <mdb-col>
          <mdb-tbl sm bordered scrollY maxHeight="150px">
            <mdb-tbl-head color="light-blue lighten-5">
            
              <tr>
                <th width="20%">Call Start Time</th>
                <th width="8%">Call duration</th>
                <th width="8%">DNIS</th>
                <th width="8%">AgentId</th>
                <th width="26%">Disposition</th>
                <th width="30%">Notes</th>
              </tr>
            </mdb-tbl-head>
            <mdb-tbl-body v-for="callDetail in callHistory" :key=callDetail.id>
              <tr>
                <td>{{callDetail.startTime}}</td>
                <td>{{callDetail.callDuration}}</td>
                <td>{{callDetail.dnis}}</td>
                <td>{{callDetail.agentId}}</td>
                <td>{{callDetail.disposition}}</td>
                <td>{{callDetail.notes}}</td>
              </tr>
            </mdb-tbl-body>
          </mdb-tbl>
        </mdb-col>
      </mdb-row>
      <mdb-container fluid v-else class="p-4">
        <h4 class="grey-text">Waiting for call</h4>
      </mdb-container>
      <!-- <button @click="selectCallHistory">Select</button> -->
    </template>
  </widget>
</template>

<script>
import Widget from "@/components/agc/Widget";
import { CALL_STATES } from "@/defines.js";
import {
  mdbRow,
  mdbCol,
  // mdbContainer,
  mdbTbl,
  mdbTblHead,
  mdbTblBody
} from "mdbvue";
// import { mdbCard, mdbCardBody, mdbCardHeader } from "mdbvue";
import { mdbTable } from "mdbvue";

export default {
  name: "CallHistory",
  components: {
    // mdbCard,
    // mdbCardBody,
    // mdbCardHeader
     mdbRow,
    mdbCol,
    mdbTable,
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    Widget
  },
  props: {
    msg: String,
    callHistory:JSON,
    cli:String
  },
  methods:{
    async selectCallHistory(){
      console.log('hi')
      let resp = await this.$store.dispatch("selectCallRecord");
      console.log(resp)
      this.callHistory=resp
      console.log(this.callHistory)
    },
    async insertCallHistory(){
      console.log('hi')
      let resp = await this.$store.dispatch("insertCallRecord");
      console.log(resp)
    }
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
    currentCallState() {
      if (this.myCall) {
        return this.myCall.status;
      } else {
        return null;
      }
    },
    isCallActive() {
      // let callStatus = this.$store.getters.getCallStatus;
      // console.log("callStatus = "+callStatus)
      // return (
      //   callStatus === CALL_STATES.TALKING ||
      //   callStatus === CALL_STATES.HELD ||
      //   callStatus === CALL_STATES.RINGING
      // );
      return true;
    }
  },
  watch: {
    currentCallState(newState, oldState) {
      console.log("call state changed from:" + oldState + " to " + newState);
      if(newState !==null){
          if(newState===CALL_STATES.DROPPED){
              this.insertCallHistory()
            //  this.$store.dispatch("updateAgentNotes", this.Notevalue);
          }
          else if(newState===CALL_STATES.RINGING){
              this.cli=this.myCall.callingAddress
              this.selectCallHistory()
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
</style>
