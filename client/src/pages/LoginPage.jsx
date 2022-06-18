import React, {useEffect, useState} from 'react';
import Input from "../components/UI/Input/Input";
import '../styles/LoginPage.css'
import Button from "../components/UI/Button/Button";
import {useHttp} from "../hooks/useHttp";
import {useDispatch} from "react-redux";
import {addMessageHandler} from "../store/messagesReducer";
import {userLoginHandler} from "../store/userReduser";

const LoginPage = () => {
    const dispatch = useDispatch()
    const [form, setForm] = useState({login: '', password: ''})
    const [loginRequest, requestLoading, requestError, clearError] = useHttp()

    useEffect(() => {
        dispatch(addMessageHandler(requestError))
        clearError()
    }, [requestError])

    async function submit(e) {
        e.preventDefault()

        let body = {
            login: form.login,
            password: form.password
        }

        try {
            const data = await loginRequest('/api/user/auth', "POST", body, {})

            if (data && data.token) {
                dispatch(addMessageHandler(data.message))
                dispatch(userLoginHandler({
                    token: data.token,
                    role: data.role
                }))
            }

        } catch (e) {}
    }

    return (
        <div className="container">
            <form onSubmit={submit} className="form" autoComplete="off">
                <h2 className="title">
                    Авторизация
                </h2>
                <Input
                    placeholder="Введите логин"
                    type="text"
                    required="required"
                    autoComplete="off"
                    value={form.login}
                    onChange={e => setForm({...form, login: e})}
                    disabled={requestLoading}
                />
                <Input
                    placeholder="Введите пароль"
                    type="password"
                    required="required"
                    autoComplete="off"
                    value={form.password}
                    onChange={e => setForm({...form, password: e})}
                    disabled={requestLoading}
                />
                <p className="addText">Забыли пароль</p>
                <Button
                    type="submit"
                    disabled={requestLoading}
                >
                    Войти
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;