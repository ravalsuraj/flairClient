import { AGENT_STATES } from "./defines";

export const config = {
    WebSocketUrl: "http://localhost:9092",

    crmBaseUrl: 'http://andrewreifman.com/se7en/',
    crmUrl: 'http://localhost:9527/#/dashboard',
    sugarCrmUrl: "https://auth.sugarcrm.com/",

    defaultAuxCodes: {
        3: {
            label: 'Ready',
            state: AGENT_STATES.READY,
            userSelectable: true,
            reasonCode: 0
        },
        4: {
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
        width: "2p5",
        widgets: [
            {
                name: 'call-details'
            },
            {
                name: 'menu-traversal'
            },

        ],
    },
    middleComponents: {
        width: "7",
        widgets: [
            {
                name: 'crm-frame'
            }


        ]
    }
    ,
    rightComponents:
    {
        width: "2p5",
        widgets: [
            {
                name: 'call-disposition'
            },

            {
                name: 'sms-helper'
            },
            {
                name: 'quick-links'
            },
            {
                name: 'agent-call-statistics'
            }
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