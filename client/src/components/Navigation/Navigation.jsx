import React, {useEffect, useState} from 'react';
import cs from './Navigation.module.css'
import Logo from "../Logo/Logo";
import NavProfile from "../NavProfile/NavProfile";
import {useLocation} from "react-router-dom";

const Navigation = () => {
    let location = useLocation();
    const [locationName, setLocationName] = useState('')

    useEffect(() => {
        switch (location.pathname) {
            case "/control":
                setLocationName("Управление")
                break
            case "/profile":
                setLocationName("Профиль")
                break
            case "/panel":
                setLocationName("Панель управления")
                break
            case "/login":
                setLocationName("Авторизация")
                break
            case "/registration":
                setLocationName("Заселение")
                break
            case "/relocation":
                setLocationName("Переселение")
                break
            case "/eviction":
                setLocationName("Выселение")
                break
            default :
                setLocationName(location.pathname)
                break
        }
    }, [location.pathname])


    return (
        <header className={cs.header}>
            <div className="container d-flex" style={{alignItems: "center", justifyContent: "space-between"}}>
                <Logo/>
                <h2 className={cs.pgName}>
                    {locationName}
                </h2>

                <NavProfile/>
            </div>
        </header>
    );
};

export default Navigation;