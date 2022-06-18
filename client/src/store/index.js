import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";

import {userReducer} from "./userReduser";
import {messagesReducer} from "./messagesReducer";

const rootReducer = combineReducers({
    user: userReducer,
    messages: messagesReducer
})

export const store = createStore(rootReducer, composeWithDevTools())