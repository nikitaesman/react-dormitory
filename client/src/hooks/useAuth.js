import {useHttp} from "./useHttp";
import {useDispatch} from "react-redux";
import {userClearHandler, userLoginHandler} from "../store/userReduser";
import {addMessageHandler} from "../store/messagesReducer";


export const useAuth = () => {
    const dispatch = useDispatch()
    const [request] = useHttp()
    async function checkAuthenticate() {

        const localData = JSON.parse(localStorage.getItem('userData'))

        try {
            if (localData === null || localData.token === null) {
                throw new Error()
            }

            const data = await request('/api/user/refresh-token', "GET", null, {authorization: 'Bearer ' + localData.token})

            if (data && data.type === "SUCCESSFUL") {
                return dispatch(userLoginHandler({token: data.token, role: data.role}))
            }

            throw new Error('Пожалуйста авторизируйтесь снова')
        } catch (e) {
            dispatch(addMessageHandler(e.message))
            dispatch(userClearHandler())
        }

    }
    return {checkAuthenticate}
}