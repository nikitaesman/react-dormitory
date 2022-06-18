import React from 'react';
import Button from "../UI/Button/Button";
import cs from './WiFiConnect.module.css'

const WiFiConnect = () => {
    return (
        <div className={cs.box}>
            <h2 className={cs.title}>
                Wi-Fi доступ
            </h2>
            <Button>
                Подключиться
            </Button>
        </div>
    );
};

export default WiFiConnect;