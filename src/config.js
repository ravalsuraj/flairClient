import { AGENT_STATES } from "./defines";

export const config = {
    WebSocketUrl: 'http://localhost:9092',
    defaultAuxCodes: {
        'READY': {
            label: 'Ready',
            state: AGENT_STATES.READY,
            userSelectable: true,
            reasonCode: 0
        },
        'NOT_READY': {
            label: 'Not Ready',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 0
        },
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
            label: 'Lunch Break',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 21
        },
        {
            label: 'Training',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 22
        },
        {
            label: 'End of Shift',
            state: AGENT_STATES.NOT_READY,
            userSelectable: true,
            reasonCode: 23
        },
    ],

    crmBaseUrl: 'http://andrewreifman.com/se7en/',
    crmUrl: 'http://localhost:9527/#/dashboard',
    sugarCrmUrl: "https://auth.sugarcrm.com/",

    leftComponents: {
        width: "3",
        widgets: [

            {
                name: 'call-disposition'
            },
            {
                name: 'quick-links'
            }
        ],
    },
    middleComponents: {
        width: "9",
        widgets: [
            {
                name: 'crm-frame'
            }


        ]
    }
    ,
    rightComponents:
    {
        width: "4",
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