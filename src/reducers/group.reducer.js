import {
    groupConstant
} from "../actions/constant"

const initState = {
    groups: [],
    members: [],
    messages: [],
    newgroupId: ''
}

export default (state = initState, action) => {
    switch (action.type) {
        case `${groupConstant.CREATE_GROUP}_REQUEST`:
            state = {
                ...state
            }
            break;

        case groupConstant.CREATE_GROUP:
            state = {
                ...state,
                messages: [],
                members: action.payload.groupInfo,
                newgroupId: action.payload.groupId
            }
            break;

        case `${groupConstant.GET_GROUPLIST}_REQUEST`:
            state = {
                ...state
            }
            break;

        case `${groupConstant.GET_GROUPLIST}_SUCCESS`:
            state = {
                ...state,
                groups: action.payload.grouplist
            }
            break;

        case `${groupConstant.GET_GROUPLIST}_FAILURE`:
            state = {
                ...state
            }
            break;

        case `${groupConstant.NEW_MESSAGE}_SENT`:
            state = {
                ...state
            }
            break;

        case `${groupConstant.GROUP_MESSAGES}_SUCCESS`:
            state = {
                ...state,
                messages: action.payload.messages
            }
            break;

        case `${groupConstant.GROUP_MESSAGES}_FAILURE`:
            state = {
                ...state
            }
            break;

        case groupConstant.GROUP_MEMBERS:
            state = {
                ...state,
                members: action.payload.membersList
            }
            break;

        case `${groupConstant.GROUP_MEMBERS}_FAILURE`:
            state = {
                ...state,
                members: action.payload.membersList
            }
            break;
    }

    return state;
}