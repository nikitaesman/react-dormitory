import React, {useEffect, useState} from 'react';
import Modal from "../Modal/Modal";
import cs from './PaymentModal.module.css'
import visaImage from '../../image/payment/visa.png'
import mastercardImage from '../../image/payment/mastercard.png'
import mirImage from '../../image/payment/mir.png'
import iconCardImage from '../../image/payment/icons/card.png'
import iconCalendarImage from '../../image/payment/icons/calendar.png'
import iconLockImage from '../../image/payment/icons/lock.png'
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../../hooks/useHttp";
import {addMessageHandler} from "../../store/messagesReducer";
import {useUserInfo} from "../../hooks/useUserInfo";


const PaymentModal = ({modal, setModal}) => {
    const dispatch = useDispatch()
    const {getUserInfo} = useUserInfo()
    const user = useSelector(state => state.user)
    const [sum, setSum] = useState(0)
    const [request, loading, error, clearError] = useHttp()

    useEffect(() => {
        setSum(user.info.price)
    },[])

    useEffect(() => {
        console.log("sum",sum)
    },[sum])

    async function payHandler(e) {
        e.preventDefault()
        try {
            if (sum === '' || typeof(sum) !== 'number') {
                throw new Error('Введите сумму платежа')
            }

            const body = {
                amount: sum,
                price: user.info.price
            }

            const data = await request('/api/payment/pay', 'POST', body, {authorization: `Bearer ${user.token}`})

            if (data && data.type === "SUCCESSFUL") {
                setModal(false)
                dispatch(addMessageHandler(data.message))
                getUserInfo()
            }
        } catch (e) {
            dispatch(addMessageHandler(e.message))
        }
    }

    return (
        <Modal modalOpen={modal} setModalOpen={setModal}>
            <div className={cs.body}>
                <section className={cs.description}>
                    <div className={cs.container}>
                        <div className={cs.description__content}>
                            <div className={cs.description__info}>
                                <p className={cs.description__course}>
                                    Тариф: {user.info.price} руб./мес.
                                </p>
                                <p className={cs.description__email}>
                                    ФИО: {user.info.surname+' '+ user.info.name +' '+ user.info.patronymic}
                                </p>
                            </div>
                            <div className={cs.description__money}>
                                <p className={cs.description__price}>
                                    <input type={"number"} className={cs.sumInput} value={sum} onChange={e => setSum(parseInt(e.target.value))} required/>
                                    <span className={cs.grey__text +" "+cs.rubSymbol}>₽</span>
                                </p>
                                <div className={cs.description__additionally}>
                                    <div className={cs.additionally__title}>
                                        Описание
                                    </div>
                                    <div className={cs.additionally__text}>
                                        Дополнитеьная информация
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={cs.payment}>
                    <div className={cs.container}>
                        <h2 className={cs.payment__title}>
                            Оплата банковской картой
                        </h2>
                        <form className={cs.payment__form} onSubmit={e => payHandler(e)}>
                            <div className={cs.payment__systems}>
                                <h3 className={cs.systems__title}>
                                    Поддерживаемые платёжные системы
                                </h3>
                                <div className={cs.systems__images}>
                                    <img src={visaImage} className={cs.systems__img} alt="visa"/>
                                    <img src={mastercardImage} className={cs.systems__img} alt="mastercard"/>
                                    <img src={mirImage} className={cs.systems__img} alt="mir"/>
                                </div>
                            </div>
                            <div className={cs.payment__credentials}>
                                <div className={cs.input__box}>
                                    <input className={cs.payment__input} placeholder="Card number" maxLength="12" required/>
                                        <label className={cs.payment__input__label} htmlFor="card__number">
                                            <img src={iconCardImage}/>
                                        </label>
                                </div>
                                <div className={cs.credentials__wrap}>
                                    <div className={cs.input__box}>
                                        <input className={cs.payment__input + ' ' + cs.credentials__wrap_input1} placeholder="MM / YY" maxLength="4" required/>
                                        <label className={cs.payment__input__label} htmlFor="card__date">
                                            <img src={iconCalendarImage}/>
                                        </label>
                                    </div>
                                    <div className={cs.input__box}>
                                        <input className={cs.payment__input + ' ' + cs.credentials__wrap_input2} id="card__cvc" placeholder="CVC" maxLength="3" required/>
                                        <label className={cs.payment__input__label} htmlFor="card__cvc">
                                            <img src={iconLockImage}/>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <p className={cs.payment__text}>
                                Data is protected under the PCI DSS standard. We do not store your data and do not share it with the
                                merchant.
                            </p>
                            <button className={cs.button} type="submit">
                                Оплатить
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </Modal>
    );
};

export default PaymentModal;