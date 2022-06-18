import React, {useEffect, useState} from 'react';
import cs from '../styles/ProfilePage.module.css'
import profileImage from '../image/ava.jpg'
import cameraImage from '../image/icons/camera.png'
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/UI/Loader/Loader";
import Input from "../components/UI/Input/Input";
import Button from "../components/UI/Button/Button";
import {addMessageHandler} from "../store/messagesReducer";
import {useHttp} from "../hooks/useHttp";

const ProfilePage = () => {
    const dispatch = useDispatch()
    const [request, loading, error, clearError] = useHttp()
    const {token, info} = useSelector(state => state.user)
    const [changeLogin, setChangeLogin] = useState({old: '', new1: '', new2: ''})
    const [changePassword, setChangePassword] = useState({old: '', new1: '', new2: ''})

    useEffect(()=> {
        clearError()
    }, [error])

    async function changeLoginHandler(e) {
        e.preventDefault()
        try {
            if (changeLogin.new1 !== changeLogin.new2) {
                throw new Error('Новый логин и его повторение должны совпадать')
            }
            const body = {
                oldLogin: changeLogin.old,
                newLogin: changeLogin.new1
            }
            const data = await request('/api/user/change-login', "POST", body, {authorization: `Bearer ${token}`})

            if (data && data.type === "SUCCESSFUL") {
                dispatch(addMessageHandler(data.message))
            }
        }catch (e) {
            dispatch(addMessageHandler(e.message))
        }
    }

    async function changePasswordHandler(e) {
        e.preventDefault()
        try {
            if (changePassword.new1 !== changePassword.new2) {
                throw new Error('Новый пароль и его повторение должны совпадать')
            }
            const body = {
                oldPassword: changePassword.old,
                newPassword: changePassword.new1
            }
            const data = await request('/api/user/change-password', "POST", body, {authorization: `Bearer ${token}`})

            if (data && data.type === "SUCCESSFUL") {
                dispatch(addMessageHandler(data.message))
            }
        }catch (e) {
            dispatch(addMessageHandler(e.message))
        }
    }

    if (!info) {
        return (
            <Loader/>
        )
    }
    return (
        <section className={cs.Profile}>
            <div className="container">
                <div className={cs.uProfile}>
                    <img src={profileImage} className={cs.photo}/>
                    <div className={cs.information}>
                        <h2 className={cs.fullName}>
                            {info.surname + ' ' + info.name + ' ' + info.patronymic}
                        </h2>
                        <div className={cs.infoList}>
                            <p className={cs.text}>
                                {info.login}
                            </p>
                            <p className={cs.text}>
                                {info.date_of_b}
                            </p>
                            <p className={cs.text}>
                                {info.tel}
                            </p>
                            <p className={cs.text}>
                                {info.speciality}
                            </p>
                            <p className={cs.text}>
                                 Этаж {info.level}
                            </p>
                            <p className={cs.text}>
                                Комната {info.room}
                            </p>
                        </div>
                    </div>
                    <div className={cs.updatePhoto}>
                        <img src={cameraImage} className={cs.updatePhotoImage}/>
                        <p className={cs.updatePhotoText}>
                            Загрузить фото профиля
                        </p>
                    </div>
                </div>
                <div className={cs.uSettings}>
                    <form className={cs.change} onSubmit={e => changeLoginHandler(e)}>
                        <h2 className={cs.changeTitle}>
                            Изменение логина
                        </h2>
                        <Input onChange={e => setChangeLogin({...changeLogin, old: e})} placeholder="Введите старый логин" required/>
                        <Input onChange={e => setChangeLogin({...changeLogin, new1: e})} placeholder="Введите новый логин" required/>
                        <Input onChange={e => setChangeLogin({...changeLogin, new2: e})} placeholder="Повторите новый логин" required/>
                        <Button type="submit">
                            Изменить логин
                        </Button>
                    </form>
                    <form className={cs.change} onSubmit={e => changePasswordHandler(e)}>
                        <h2 className={cs.changeTitle}>
                            Изменение пароля
                        </h2>
                        <Input onChange={e => setChangePassword({...changePassword, old: e})} placeholder="Введите старый пароль" required/>
                        <Input onChange={e => setChangePassword({...changePassword, new1: e})} placeholder="Введите новый пароль" required/>
                        <Input onChange={e => setChangePassword({...changePassword, new2: e})} placeholder="Подтвердите новый пароль" required/>
                        <Button type="submit">
                            Изменить пароль
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;