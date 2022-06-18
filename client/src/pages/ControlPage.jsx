import React from 'react';
import Payment from "../components/Payment/Payment";
import WiFiConnect from "../components/WiFiConnect/WiFiConnect";
import '../styles/ControlPage.css'
import QRCode from "../components/QR-code/QR-code";
import Chat from "../components/Chat/Chat";
import Loader from "../components/UI/Loader/Loader";
import {useSelector} from "react-redux";

const ControlPage = () => {
    const user = useSelector(state => state.user)

    if (!user.info) {
        return (
            <Loader/>
        )
    }
    return (
        <section className="controlPage">
            <div className="container d-flex">
                <Payment/>
                <div className="column">
                    <QRCode/>
                    <WiFiConnect/>
                </div>
                <Chat/>
            </div>
        </section>
    );
};

export default ControlPage;