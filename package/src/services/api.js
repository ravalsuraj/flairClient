import axios from 'axios'
import querystring from 'querystring'
let instance = axios.create({
    baseURL: "https://cors-anywhere.herokuapp.com/http://in.crm.kefu.mi.com/api",
    timeout: 15000
});
export default {
    sendSmsRequestToGateway(request) {
        console.log("sendSmsRequestToGateway(): request received Request=", request)

        return instance.get('/bulksms?username=di78-agcnet&password=digimile&type=0&dlr=1&destination=' + request.cli + '&source=AGCNTW&message=' + request.message, {}).then(response => {
            console.log("sendSmsRequestToGateway() response=", response)

            return response
        }).catch(error => {
            console.log("sendSmsRequestToGateway() :  error=", error)
            throw error
        })
    },

    testXiaomiApi() {
        console.log("testXiaomiApi(): request received Request=")

        const body = {
            "data": "eyJoZWFkZXIiOnsiYXBwaWQiOiJpbi1hdmF5YSIsInNpZ24iOiI3RjdGOTgzMEZFNzFENzc1MjU1MkZENjBBRkY0MTZCNCJ9LCJib2R5Ijoie1wic2VhcmNoVHlwZVwiOlwicGhvbmVcIixcInBob25lXCI6XCI5ODExOTc4Njc0XCIsXCJvcmRlcklkXCI6XCI1ODQ0N1wifSJ9"
        }

        const head = {
            "content-type": "application/x-www-form-urlencoded",
            "appid": "in-avaya",
            "sign": "7F7F9830FE71D7752552FD60AFF416B4",
            "Accept": "application/json"

        }

        return instance.post('/order/getOrderStatus', querystring.stringify(body), { headers: head }).then(response => {
            console.log("getAccountIdFromPhoneNumber() response=", response)
            return response
        }).catch(error => {
            console.log("getAccountIdFromPhoneNumber() :  error=", error)
            throw error
        })
    }
}