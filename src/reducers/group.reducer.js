import { groupConstant } from "../actions/constant"

const initState = {
    groups: [],
    members: [],
    messages: []
}

export default (state = initState, action) => {    
    switch(action.type) {
        case `${groupConstant.CREATE_GROUP}_REQUEST`:
            state = {
                ...state
            }
            break;

        case groupConstant.CREATE_GROUP:
            state = {
                ...state,                
                members: action.payload.ids
            }
            break;
    }

    return state;
}