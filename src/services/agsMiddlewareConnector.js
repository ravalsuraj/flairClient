import axios from 'axios'
import querystring from 'querystring'

import config from './../../static/settings.json'

let instance = axios.create({
  baseURL: config.AGS.MIDDLEWARE.URL,
  timeout: config.AGS.MIDDLEWARE.TIMEOUT
})
export default {
  fetchLobFromDnis(request) {
    console.log('fetchLobFromDnis(): request received Request=', request)

    return instance
      .get('/api/lob/dnis/' + request.dnis, {})
      .then(response => {
        console.log('fetchLobFromDnis() response=', response)

        return response.data
      })
      .catch(error => {
        console.log('fetchLobFromDnis() :  error=', error)
        throw error
      })
  },

  async postCallDisposition(request) {
    console.log('fetchLobFromDnis(): request received Request=', request)

    let body = {
      ucid: request.ucid,
      callId: request.callId,
      cli: request.cli,
      dnis: request.dnis,
      call_start_date_time: request.call_start_date_time,
      call_end_date_time: request.call_end_date_time,
      disposition: request.disposition,
      sub_disposition: request.sub_disposition
    }
    try {
      const response = await instance.post('/api/call/disposition', body, {})
      console.log('fetchLobFromDnis() response=', response)
      return response.data
    } catch (error) {
      console.log('fetchLobFromDnis() :  error=', error)
      throw error
    }
  }
}
