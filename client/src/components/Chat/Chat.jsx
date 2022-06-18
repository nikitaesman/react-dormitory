import React from 'react';
import cs from './Chat.module.css'

const Chat = () => {
    return (
        <div className={cs.Chat}>
            <h2 className={cs.title}>
                Чат с дежурным
            </h2>
            <div className={cs.chat}>
                <div className={cs.messagesBox}>
                    <div className={cs.messageCompanion}>
                        Здравствуйте мы с удовольствием ответим на интерисующие вас вопросы
                    </div>
                    <div className={cs.messageSelf}>
                        Здравствуйте, когда производится проверка чистоты комнат?
                    </div>
                </div>
                <form className={cs.sendFrom}>
                    <input className={cs.sendInput} placeholder={"Введите сообщение"}/>
                    <button className={cs.sendButton} type="submit">
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;