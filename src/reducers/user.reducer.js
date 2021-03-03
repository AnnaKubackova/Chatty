import { userConstant } from "../actions/constant"

const initState = {
    users: [],
    messages: []
}

export default (state = initState, action) => {
    switch(action.type) {
        case `${userConstant.GET_ONLINE_USERS}_REQUEST`:
            break;
        
        case `${userConstant.GET_ONLINE_USERS}_SUCCESS`:
            state = {
                ...state,
                users: action.payload.users
            }
            break;

        case userConstant.GET_MESSAGE:
            state = {
                ...state,
                messages: action.payload.messages
            }
            break;

        case `${userConstant.GET_MESSAGE}_FAILURE`:
            state = {
                ...state,
                messages: action.payload.messages
            }
            break;
    }

    return state;
}