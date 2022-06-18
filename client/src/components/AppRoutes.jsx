import React from 'react';
import {Route, Routes, Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import ControlPage from "../pages/ControlPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import PanelPage from "../pages/PanelPage";
import RegistrationPage from "../pages/RegistrationPage";
import RelocationPage from "../pages/RelocationPage";
import EvictionPage from "../pages/EvictionPage";


const AppRoutes = () => {
    const user = useSelector(state => state.user)

    if (user.isAuth === false) {
        return (
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="*" element={<Navigate to="/login" />}/>
            </Routes>
        );
    }
    if (user.role === "PERSONAL") {
        return (
            <Routes>
                <Route path="/panel" element={<PanelPage/>}/>
                <Route path="/registration" element={<RegistrationPage/>}/>
                <Route path="/relocation" element={<RelocationPage/>}/>
                <Route path="/eviction" element={<EvictionPage/>}/>
                <Route path="*" element={<Navigate to="/panel" />}/>
            </Routes>
        );
    }else {
        return (
            <Routes>
                <Route path="/control" element={<ControlPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="*" element={<Navigate to="/control" />}/>
            </Routes>
        );
    }


};

export default AppRoutes;