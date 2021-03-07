import { userConstant } from "../actions/constant"

const initState = {
    users: [],
    messages: [],
    chats: [],
    chatusers: []
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

        case userConstant.GET_NEWMESSAGE:
            break;

        case userConstant.GET_CHAT:
            state = {
                ...state,
                chats: action.payload.unique
            }
            break;

        case `${userConstant.GET_CHAT}_FAILURE`:
            state = {
                ...state,
                chats: action.payload.unique
            }
            break;

        case `${userConstant.GET_CHATUSERS}_REQUEST`:
            state = {
                ...state,
                chatusers: action.payload.users
            }
            break;

        case userConstant.GET_CHATUSERS:
            state = {
                ...state,
                chatusers: action.payload.users
            }
            break;

        case `${userConstant.GET_CHATUSERS}_FAILURE`:
            state = {
                ...state,
                messages: action.payload.users
            }
            break;
    }

    return state;
}