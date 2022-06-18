import React, {useEffect} from 'react';
import profileImage from "../../image/icons/profile.png";
import arrowImage from "../../image/icons/expand.png";
import cs from './NavProfile.module.css'
import {useDispatch, useSelector} from "react-redux";
import {useUserInfo} from '../../hooks/useUserInfo'
import Loader from "../UI/Loader/Loader";
import {userLogoutHandler} from "../../store/userReduser";
import {addMessageHandler} from "../../store/messagesReducer";
import {Link} from "react-router-dom";

const NavProfile = () => {
    const dispatch = useDispatch()
    const {isAuth, info, role} = useSelector(state => state.user)
    const {getUserInfo} = useUserInfo()


    useEffect(() => {
        if (isAuth) {
            getUserInfo()
        }
    },[isAuth])

    function logoutClick() {
        dispatch(userLogoutHandler())
        dispatch(addMessageHandler('Вы вышли из аккаунта'))
    }

    if (isAuth === false) {
        return (
            <a href="mailto:my-dormitory@gmail.com" target="_blank" className={cs.mail}>
                my-dormitory@gmail.com
            </a>
        )
    }

    return (
        <div className={cs.profile}>
            <img className={cs.profile__img} src={profileImage}/>
            {info ? <div className={cs.profile__name}>
                        {info.name}
                    </div>
                : <Loader small={true}/>}
            <img className={cs.profile__arrow} src={arrowImage}/>
            {role === "PERSONAL"
                ? <nav className={cs.nav}>
                    <Link to="/panel" className={cs.link}>
                        Панель
                    </Link>
                    <Link to="/registration" className={cs.link}>
                        Заселение
                    </Link>
                    <Link to="/relocation" className={cs.link}>
                        Переселение
                    </Link>
                    <Link to="/eviction" className={cs.link}>
                        Выселение
                    </Link>
                    <div onClick={logoutClick} className={cs.link}>
                        Выход
                    </div>
                </nav>
                : <nav className={cs.nav}>
                    <Link to="/control" className={cs.link}>
                        Управление
                    </Link>
                    <Link to="/profile" className={cs.link}>
                        Профиль
                    </Link>
                    <div onClick={logoutClick} className={cs.link}>
                        Выход
                    </div>
                </nav>
            }

        </div>
    );
};

export default NavProfile;