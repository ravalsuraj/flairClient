export const AGENT_STATES = Object.freeze({
  UNKNOWN: 0,
  LOG_IN: 1,
  LOG_OUT: 2,
  NOT_READY: 3,
  READY: 4,
  WORK_NOT_READY: 5,
  WORK_READY: 6,
  BUSY: 7,
  Text: {
    '0': 'UNKNOWN',
    '1': 'LOG_IN',
    '2': 'LOG_OUT',
    '3': 'NOT_READY',
    '4': 'READY',
    '5': 'WORK_NOT_READY',
    '6': 'WORK_READY',
    '7': 'BUSY'
  }
})

export const RESPONSE_CODES = Object.freeze({
  SUCCESS: '0'
})

export const TIMER_STATES = Object.freeze({
  STOP: 0,
  START: 1,
  PAUSE: 2,
  RESET: 3
})

export const TIMER_DIRECTIONS = Object.freeze({
  UP: "UP",
  DOWN: "DOWN"
})


export const TIMER_TYPES = Object.freeze({
  CALL_TIMER: 'CT',
  IN_STATE_TIMER: 'ST'
})
// States according to Avaya: [Login, Ready, Not Ready, Wrap-Up, Pending States]
export const CALL_STATES = Object.freeze({
  IDLE: '96',
  RINGING: '97',
  TALKING: '98',
  HELD: '99',
  BRIDGED: '100',
  INUSE: '101',
  DROPPED: '102',
  UNKNOWN: '103',
  CREATED: '106',
  Text: {
    '96': 'IDLE',
    '97': 'RINGING',
    '98': 'TALKING',
    '99': 'HELD',
    '100': ' BRIDGED',
    '101': 'INUSE',
    '102': 'DROPPED',
    '103': 'UNKNOWN',
    '106': 'CREATED'
  }
})

export const CALL_TYPES = Object.freeze({
  INBOUND: '1',
  CONSULTED: '2',
  OUTBOUND: '3',
  UNKNOWN: '99',
})

export const MULTI_CALL_STATES = Object.freeze({
  SINGLE: '1',
  CONSULTED: '2',
  TRANSFERED: '3',
  CONFERENCED: '4'
})


export const SOCKET_STATES = Object.freeze({
  CONNECTED: 'CONNECTED',
  CONNECTING: 'CONNECTING',
  DISCONNECTED: 'DISCONNECTED'
})

export const MESSAGE_TYPES = Object.freeze({
  CTRL_REQ: 'ZC',
  CTRL_RES: 'ZR',

  TELE_CMD: 'TC',
  TELE_RES: 'TR',

  EVNT_CMD: 'EC',
  EVNT_RES: 'ER'
})

export const SOCKET_EVENTS = Object.freeze({
  GET_SESSION: 'GETSESSION',
  END_SESSION: 'ENDSESSION',
  CHECK_SESSION: 'CHECKSESSION',

  REJOIN_SESSION: 'REJOINSESSION',

  MONITOR_STATION: 'MONDEV',
  MONITOR_END: 'MONEND',
  MAKE_CALL: 'MAKECALL',
  ANSWER_CALL: 'ANSCALL',
  REJECT_CALL: 'REJCALL',
  DROP_CALL: 'CONNCLR',
  HOLD_CALL: 'HOLDCALL',
  RETRIEVE_CALL: 'RETRCALL',
  CONSULT_CALL: 'CONSTCALL',
  RECONNECT_CALL: 'RECONCALL',
  TRANSFER_CALL: 'XFERCALL',
  CONFERENCE_CALL: 'CONFCALL',
  AGENT_LOGIN: 'AGTLOGON',
  AGENT_LOGOFF: 'AGTLOGOFF',
  SET_AGENT_STATE: 'SETAGTSTATE',
  QUERY_AGENT_STATE: 'QRYAGTSTATE',
  QUERY_AGENT_LOGIN: 'QRYAGTLOGIN',

  INCOMING_CALL_RINGING: 'ICALLRING',
  INCOMING_CALL_DISCONNECTED: 'ICALLDISC',
  INCOMING_CALL_TALKING: 'ICALLTALK',
  INCOMING_CALL_HELD: 'ICALLHLD',

  OUTGOING_CALL_RINGING: 'CONCALLRING',
  OUTGOING_CALL_DISCONNECTED: 'CONCALLDISC',
  OUTGOING_CALL_TALKING: 'CONCALLTALK',

  AGENT_STATE_UPDATED: "AGTUPDATED"
})



export default {
  RESPONSE_CODES
}