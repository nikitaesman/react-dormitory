import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "./useHttp";
import {addMessageHandler} from "../store/messagesReducer";
import {userSetInfoHandler} from "../store/userReduser";

export const useUserInfo = () => {
    const dispatch = useDispatch()
    const [infoRequest, infoLoading] = useHttp()
    const {isAuth, token} = useSelector(state => state.user)

    async function getUserInfo() {

        if (isAuth !== true) {
            return dispatch(addMessageHandler('Не удалось получить информацию о пользователе'))
        }

        try {
            const data = await infoRequest('/api/user/info', "GET", null, {authorization: 'Bearer ' + token})

            if(data.type === "SUCCESSFUL") {
                dispatch(userSetInfoHandler(data.info))
            }
        } catch (e) {
            dispatch(addMessageHandler('Не удалось получить информацию о пользователе'))
        }
    }
    return {getUserInfo}
}