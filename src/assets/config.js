const AGENT_STATES = Object.freeze({
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

export default {
  FLAIR_AWS_PORT: 8080,
  FLAIR_SERVER_URL: 'http://localhost:9092',
  SERVER_TIMEOUT_MS: 20000,
  CRM_URL: 'http://localhost:9527/#/dashboard',
  CRM_TIMEOUT_MS: 10000,

  //Admin Config. Do not modify
  defaultAuxCodes: [
    {
      label: 'Ready',
      state: AGENT_STATES.READY,
      userSelectable: true,
      reasonCode: null
    },
    {
      label: 'After Call Work',
      state: AGENT_STATES.WORK_NOT_READY,
      userSelectable: false,
      reasonCode: null
    },
    {
      label: 'Work Ready',
      state: AGENT_STATES.WORK_READY,
      userSelectable: false,
      reasonCode: null
    },
    {
      label: 'Busy',
      state: AGENT_STATES.BUSY,
      userSelectable: false,
      reasonCode: null
    }
  ],
  agentAuxCodes: [
    {
      label: 'Ready',
      state: AGENT_STATES.READY,
      reasonCode: null
    },

    {
      label: 'Not Ready',
      state: AGENT_STATES.NOT_READY,
      reasonCode: 0
    },
    {
      label: 'Lunch',
      state: AGENT_STATES.NOT_READY,
      reasonCode: 2
    },
    {
      label: 'Dinner',
      state: AGENT_STATES.NOT_READY,
      reasonCode: 3
    },
  ],

  agentReasonCodeList: [
    {
      reasonCode: 0,
      reasonLabel: 'Not Ready'
    },
    {
      reasonCode: 2,
      reasonLabel: 'Lunch'
    },
    {
      reasonCode: 3,
      reasonLabel: 'Dinner'
    }
  ],

  leftComponents: {
    width: '0',
    widgets: []
  },
  middleComponents: {
    width: '12',
    widgets: [
      {
        name: 'crm-frame'
      }
    ]
  },
  rightComponents: {
    width: '0',
    widgets: []
  }
}

/*

        {
            label: 'Break',
            state: AGENT_STATES.NOT_READY,

            reasonCode: 1
        },
        {
            label: 'Lunch',
            state: AGENT_STATES.NOT_READY,

            reasonCode: 2
        },
        {
            label: 'Dinner',
            state: AGENT_STATES.NOT_READY,

            reasonCode: 3
        },
        {
            label: 'After Call Work',
            state: AGENT_STATES.WORK_NOT_READY,

            reasonCode: 3
        },
*/