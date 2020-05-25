<template>
 <widget title="Call History">
    <template v-slot:body>
      <div class="list-group px-3">
  <!--mdb-card>
    <mdb-card-header>Call History</mdb-card-header>
    <mdb-card-body>
      <mdb-tbl sm hover-->
        <table>
        <thead class="blue-grey lighten-4">
          <tr>
            <th>Sr.</th>
            <th>Call Start Time</th>
            <th>Call End Time</th>
            <th>DNIS</th>
            <th>CLI</th>
            <th>AgentId</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>24/06/18 05:00 pm</td>
            <td>25/06/18 05:00 pm</td>
            <td>1234</td>
            <td>8879712345</td>
            <td>8080</td>
            <td>Billing Issue</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>24/06/18 05:00 pm</td>
            <td>25/06/18 05:00 pm</td>
            <td>1234</td>
            <td>8879712345</td>
            <td>8080</td>
            <td>Billing Issue</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>24/06/18 05:00 pm</td>
            <td>25/06/18 05:00 pm</td>
            <td>1234</td>
            <td>8879712345</td>
            <td>8080</td>
            <td>Billing Issue</td>
          </tr>
        </tbody>
        </table>
      <!--/mdb-tbl>
    </mdb-card-body>
  </mdb-card-->
 <!--div class="form-group">
          <label for="exampleFormControlTextarea2">Small textarea</label>
          <textarea
          ></textarea>
  </div>
  <div>
        <a href="#" class="btn btn-danger btn-block" >Add Note</a>
      </div-->
      </div>
    </template>
  </widget>
</template>

<script>
import Widget from "@/components/agc/Widget";
// import { mdbCard, mdbCardBody, mdbCardHeader } from "mdbvue";

export default {
  name: "CallHistory",
  components: {
    // mdbCard,
    // mdbCardBody,
    // mdbCardHeader
    Widget
  },
  props: {
    msg: String
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
