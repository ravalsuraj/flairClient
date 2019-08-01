import axios from 'axios'
let instance = axios.create({
    baseURL: "http://sms.digimiles.in/bulksms",
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
    }
}