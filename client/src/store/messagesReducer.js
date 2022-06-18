const defaultState = {
    messages: []
}

export const addMessageHandler = (userPayload) => {
    return {
        type: "ADD_MESSAGE",
        payload: userPayload
    }
}

export const messagesReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "ADD_MESSAGE":
            if (!action.payload  || action.payload === '') {
                return state
            }
            const newId = Date.now()
            return {...state, messages: [...state.messages, {text: action.payload, id: newId}]}

        default:
            return state
    }
}