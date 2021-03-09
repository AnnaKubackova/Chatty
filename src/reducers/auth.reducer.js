import {
    authConstant
} from "../actions/constant"

const initState = {
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    authenticating: false,
    authenticated: false,
    error: null
}

export default (state = initState, action) => {
    switch (action.type) {
        case `${authConstant.USER_LOGIN}_REQUEST`:
            state = {
                ...state,
                authenticating: true
            }
            break;

        case `${authConstant.USER_LOGIN}_SUCCESS`:
            state = {
                ...state,
                ...action.payload.user,
                authenticated: true,
                authenticating: false
            }
            break;

        case `${authConstant.USER_LOGIN}_FAILURE`:
            state = {
                ...state,
                authenticated: false,
                authenticating: false,
                error: action.payload.error
            }
            break;
        
        case `${authConstant.GOOGLEUSER_LOGIN}_REQUEST`:
            state = {
                ...state,
                authenticating: true
            }
            break;

        case `${authConstant.GOOGLEUSER_LOGIN}_SUCCESS`:
            state = {
                ...state,
                ...action.payload.user,
                authenticated: true,
                authenticating: false
            }
            break;

        case `${authConstant.GOOGLEUSER_LOGIN}_FAILURE`:
            state = {
                ...state,
                authenticated: false,
                authenticating: false,
                error: action.payload.error
            }
            break;

        case `${authConstant.USER_LOGOUT}_REQUEST`:
            break;

        case `${authConstant.USER_LOGOUT}_SUCCESS`:
            state = {
                ...initState
            }
            break;

        case `${authConstant.USER_LOGOUT}_FAILURE`:
            state = {
                ...state,
                error: action.payload.error
            }
            break;

        case `${authConstant.UPDATE_PROFILE}_REQUEST`:
            break;

        case `${authConstant.UPDATE_PROFILE}_SUCCESS`:
            state = {
                ...initState,
                ...action.payload.user,
                authenticated: true,
                authenticating: false
            }
            break;

        case `${authConstant.UPDATE_PROFILE}_FAILURE`:
            state = {
                ...state,
                error: action.payload.error
            }
            break;

        case `${authConstant.USER_DELETE}__REQUEST`:
            break;

        case `${authConstant.USER_DELETE}_SUCCESS`:
            state = {
                ...initState
            }
            break;

        case `${authConstant.USER_DELETE}_FAILURE`:
            break;
    }

    return state;
}