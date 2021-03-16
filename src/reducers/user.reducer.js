import {
    userConstant
} from "../actions/constant"
import {
    authConstant
} from "../actions/constant"

const initState = {
    users: [],
    messages: [],
    chats: [],
    chatusers: [],
    newchatperson: [],
    unSeenMessages: 0
}

export default (state = initState, action) => {
    switch (action.type) {
        case `${userConstant.GET_ONLINE_USERS}_REQUEST`:
            break;

        case `${userConstant.GET_ONLINE_USERS}_SUCCESS`:
            state = {
                ...state,
                users: action.payload.users
            }
            break;

        case `${userConstant.GET_ONLINE_USERS}_FAILURE`:
            state = {
                ...initState
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
            state = {
                ...state,
                messages: action.payload.messages
            }
            break;

        case `${userConstant.GET_NEWMESSAGE}_FAILURE`:
            state = {
                ...state,
                messages: action.payload.messages
            }
            break;

        case userConstant.GET_CHAT:
            state = {
                ...state,
                chats: action.payload.unique
            }
            break;

        case `${userConstant.GET_CHAT}_FAILURE`:
            state = {
                ...state
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

        case `${userConstant.SET_NEWPERSON}_REQUEST`:
            state = {
                ...state,
            }
            break;

        case `${userConstant.SET_NEWPERSON}_SUCCESS`:
            state = {
                ...state,
                newchatperson: action.payload.user
            }
            break;

        case `${userConstant.SET_NEWPERSON}_FAILURE`:
            state = {
                ...state
            }
            break;

        case `${authConstant.USER_LOGOUT}_SUCCESS`:
            state = {
                ...initState
            }
            break;

        case `${userConstant.SEARCH}_SUCCESS`:
            state = {
                ...state,
                users: action.payload.users
            }
            break;
        
        case `${userConstant.CLEAR_CHAT_PERSON}_SUCCESS`:
            state = {
                ...state,
                newchatperson: action.payload.user
            }
            break;

        case userConstant.GET_UNSEENMESSAGES:
            state = {
                ...state,
                unSeenMessages: action.payload.unseen
            }
            break;
    }

    return state;
}