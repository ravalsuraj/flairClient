import { AGENT_STATES } from "./defines";

export const config = {
    WebSocketUrl: "http://localhost:9092",
    
    crmBaseUrl: 'http://andrewreifman.com/se7en/',
    CRM_TIMEOUT_MS: 10000,
    crmUrl: 'http://localhost:9527/#/dashboard',
    sugarCrmUrl: "https://auth.sugarcrm.com/",

    defaultAuxCodes: {
        3: {
            label: 'Not Ready',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 0
        },
        4: {
            label: 'Ready',
            state: AGENT_STATES.READY,
            userSelectable: true,
            reasonCode: 0
        },
        5: {
            label: 'After Call Work',
            state: AGENT_STATES.WORK_NOT_READY,
            userSelectable: true,
            reasonCode: 0
        },
        6: {
            label: 'Work Ready',
            state: AGENT_STATES.WORK_READY,
            userSelectable: true,
            reasonCode: 0
        },
        7: {
            label: 'Busy',
            state: AGENT_STATES.BUSY,
            userSelectable: false,
            reasonCode: 0
        }
    },
    agentAuxCodes: [
        {
            label: 'Ready',
            state: AGENT_STATES.READY,
            userSelectable: true,
            reasonCode: null
        },

        {
            label: 'Not Ready',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 0
        },
        {
            label: 'Break',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 1
        },
        {
            label: 'Lunch',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 2
        },
        {
            label: 'Dinner',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 3
        },
        {
            label: 'After Call Work',
            state: AGENT_STATES.WORK_NOT_READY,
            userSelectable: true,
            reasonCode: 3
        },
    ],


    leftComponents: {
        width: "0",
        widgets: [

        ],
    },
    middleComponents: {
        width: "12",
        widgets: [
            {
                name: 'crm-frame'
            }


        ]
    }
    ,
    rightComponents:
    {
        width: "0",
        widgets: [

        ],
    }

}

/*
            {
                name: 'call-details'
            },
            {
                name: 'menu-traversal'
            },
            {
                name: 'call-details'
            },
            {
                name: 'menu-traversal'
            },
            {
                name: 'quick-links'
            }

{
            name: 'call-disposition'
        },
        {
            name: 'test-bench'
        }

*/