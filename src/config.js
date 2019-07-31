import { AGENT_STATES } from "./defines";

export const config = {

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

    crmUrl: 'http://andrewreifman.com/se7en/',

    leftComponents: [
        {
            name: 'call-details'
        },
        {
            name: 'menu-traversal'
        },
        {
            name: 'quick-links'
        }
    ],
    rightComponents: [
        {
            name: 'agent-call-statistics'
        },
        {
            name: 'call-disposition'
        },
        {
            name: 'test-bench'
        }
    ],


}

