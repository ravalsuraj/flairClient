import axios from "axios";


// let instance = axios.create({
//     baseURL: "https://cors-anywhere.herokuapp.com/http://in.crm.kefu.mi.com/api",
//     timeout: 15000
// });

let instance = axios.create({
  //baseURL: "https://cors-anywhere.herokuapp.com/https://warm-oasis-63550.herokuapp.com/employee/",
  baseURL: "http://localhost/flairservice_v1/api/FlairService/",
  timeout: 15000
});

let instancenode = axios.create({
  //baseURL: "https://cors-anywhere.herokuapp.com/https://warm-oasis-63550.herokuapp.com/employee/",
  baseURL: "http://localhost:9000/Flair",
  timeout: 15000
});

export default {
  getServerIp() {
    return axios.get("/NDRRestAPI");
  },
  getConfig() {
    return axios.get("./settings.json");
  },
  insertNotedetails(req) {
   // let body = req;
   // let head = {"X-Requested-With": "XMLHttpRequest"};
   let head = {};
    //return instance.get('1234', body, { headers: head })
    console.log("Api Body " , req)
//return instance.get('?ucid=1111 &cli=98989&notes=pra1', { headers: head })

    return instance.get('Get?ucid='+ req.ucid +' &cli='+req.cli+'&notes='+ req.AgentNotes +'', { headers: head })
    // return axios.post("/config");
  },
  insertcallDisposition(req) {
    let head = {};
     console.log("Api disposition Body " , req)
 //return instance.get('?ucid=1111 &cli=98989&notes=pra1', { headers: head })
 
     return instance.get('insertDisposition?ucid='+ req.ucid +' &cli='+req.cli+'&disposition='+ req.disposition +'&subdisposition='+req.sub_disposition+'', { headers: head })
     // return axios.post("/config");
   },
   selectcallTraversal(req) {
    let head = {};
     console.log("Api Nod Traversal Body " , req)
 //return instance.get('?ucid=1111 &cli=98989&notes=pra1', { headers: head })
 
     return instance.get('GetTraversal?ucid='+ req.ucid , { headers: head })
     // return axios.post("/config");
   },

   insertCallDetail(req) {
    let body = req;
    let head = {};
    return instancenode.post('/Call', body, { headers: head })
    // return axios.post("/config");
  },
  selectCallDetail(req) {
    let body = req;
    return instancenode.get('/Calls', body)
    // return axios.post("/config");
  }
};

