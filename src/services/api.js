import axios from "axios";

});
// let instance = axios.create({
//     baseURL: "https://cors-anywhere.herokuapp.com/http://in.crm.kefu.mi.com/api",
//     timeout: 15000
// });

let instance = axios.create({
  //baseURL: "https://cors-anywhere.herokuapp.com/https://warm-oasis-63550.herokuapp.com/employee/",
  baseURL: "http://localhost/flairservice_v1/api/FlairService/",
  timeout: 15000
});

export default {
  getServerIp() {
  },
};
