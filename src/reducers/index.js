import {
    combineReducers
} from "redux";
import authReducer from "./auth.reducer";
import userReducer from "./user.reducer";
import groupReducer from "./group.reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    group: groupReducer
})

export default rootReducer;