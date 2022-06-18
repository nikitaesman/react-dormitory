const  defaultState = {
    isAuth: false,
    token: null,
    ready: false,
    role: null,
    info: null
}

export function userLoginHandler(userPayload) {
    return {
        type: "USER_LOGIN",
        payload: userPayload
    }
}

export function userLogoutHandler() {
    return {
        type: "USER_LOGOUT"
    }
}

export function userClearHandler() {
    return {
        type: "USER_CLEAR"
    }
}

export function userSetInfoHandler(userPayload) {
    return {
        type: "SET_USER_INFO",
        payload: userPayload
    }
}


export const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            let userData = {
                token: action.payload.token
            }
            localStorage.setItem('userData', JSON.stringify(userData))
            return {...state, token: action.payload.token, role: action.payload.role, isAuth: true, ready: true}

        case "USER_LOGOUT":
            localStorage.removeItem('userData')
            return {...defaultState, ready: true}

        case "USER_CLEAR":
            localStorage.removeItem('userData')
            return {...state, ready: true}

        case "SET_USER_INFO":
            return {...state, info: action.payload}
        default:
            return state
    }
}