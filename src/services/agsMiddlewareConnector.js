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
  }
}
