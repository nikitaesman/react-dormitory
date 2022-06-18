import React, {useState} from 'react';
import cs from './Payment.module.css'
import Button from "../UI/Button/Button";
import Button2 from "../UI/Button2/Button2";
import PaymentModal from "../PaymentModal/PaymentModal";
import {useSelector} from "react-redux";

const Payment = () => {
    const [modal, setModal] = useState(false)
    const user = useSelector(state => state.user)

    return (
        <section className={cs.payment}>
            <h2 className={cs.title}>
                Оплата
            </h2>
            <p className={cs.payment__text} style={{textAlign: "right"}}>
                *за услуги проживания
            </p>
            <div className={cs.amount}>
                <div className={cs.amount__item}>
                    <p className={cs.amount__title}>
                        На счёте
                    </p>
                    <p className={cs.amount__money}>
                        {user.info.amount}₽
                    </p>
                </div>
                <div className={cs.amount__item}>
                    <p className={cs.amount__title}>
                        Тариф
                    </p>
                    <p className={cs.amount__money}>
                        <span className="color__orange">
                            {user.info.price}₽/мес
                        </span>
                    </p>
                </div>
            </div>
            <Button onClick={e => setModal(true)}>
                Пополнить
            </Button>
            <p className={cs.payment__text}>
                Не забудьте пополнить до 25 числа, чтобы избежать просрочки и начисления пени
            </p>
            <Button2>
                Подключить автоплатёж
            </Button2>
            <PaymentModal modal={modal} setModal={setModal}/>
        </section>
    );
};

export default Payment;