import React, {useEffect, useState} from 'react';
import cs from '../styles/RegistrationPage.module.css'
import Input from "../components/UI/Input/Input";
import Select from "../components/UI/Select/Select";
import Button from "../components/UI/Button/Button";
import {useHttp} from "../hooks/useHttp";
import {useDispatch, useSelector} from "react-redux";
import {addMessageHandler} from "../store/messagesReducer";
import Modal from "../components/Modal/Modal";
import RoomList from "../components/RoomList/RoomList";

const RegistrationPage = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const [request, loading, error, clearError] = useHttp()
    const [modalOpen, setModalOpen] = useState(false)
    const [alreadyRegData, setAlreadyRegData] = useState({login: '', password: ''})

    useEffect(() => {
        dispatch(addMessageHandler(error))
        clearError()
    }, [error])

    const [form, setForm] = useState({
        surname: '',
        name: '',
        patronymic: '',
        date_of_b: '',
        passport: '',
        tel: '',
        separation: '',
        speciality: '',
        admission: '',
        s_group: '',
        roomNum: ''
    })
    const separationData = [
        {name: "Строительное", value: "Строительное"},
        {name: "Техническое", value: "Техническое"},
        {name: "Агрономическое", value: "Агрономическое"},
        {name: "Экономическое", value: "Экономическое"}
    ]
    const specialityData = [
        {name: "Информационные системы", value: "Информационные системы"},
        {name: "Бухгалтерский учёт", value: "Бухгалтерский учёт"},
        {name: "Автомобильное обслуживание", value: "Автомобильное обслуживание"},
        {name: "Агроэкономия", value: "Агроэкономия"},
        {name: "Виноделие", value: "Виноделие"}
    ]

    const [roomsData, setRoomsData] = useState([])

    function selectRoomHandler(roomId) {
        setForm({...form, roomNum: roomId.num})
    }

    async function formSubmitHandler(e) {
        e.preventDefault()
        if (form.name !== '',form.surname !== '',form.patronymic !== '',form.tel !== '',form.passport !== '',form.date_of_b !== '',form.separation !== '',form.speciality !== '',form.admission !== '',form.s_group !== '',form.roomNum !== '') {
            const data = await request("/api/user/registration", "POST", form, {authorization: `Bearer ${user.token}`})

            if(data && data.type === 'SUCCESSFUL') {
                setAlreadyRegData(data.temporaryLoginDetails)
                setModalOpen(true)
                dispatch(addMessageHandler("Студент успешно заселён"))
            }
        }else {
            dispatch(addMessageHandler("Заполните все поля формы и выбирите комнату"))
        }
    }

    return (
        <section className={cs.Registration}>
            <Modal complication={true} modalOpen={modalOpen} setModalOpen={setModalOpen}>
                <div className={cs.modalBox}>
                    <h2>
                        Временные данные для входа в аккаунт
                    </h2>
                    <p className={cs.modalLabel}>
                        Логин студента:
                    </p>
                    <p className={cs.modalText}>
                        {alreadyRegData.login}
                    </p>
                    <p className={cs.modalLabel}>
                        Пароль студента:
                    </p>
                    <p className={cs.modalText}>
                        {alreadyRegData.password}
                    </p>
                </div>
            </Modal>
            <div className="container">
                <div className={cs.RegistrationContent}>
                    <h1 className={cs.RegistrationTitle}>
                        Регистрация студента
                    </h1>
                    <div className={cs.wrap}>
                        <form className={cs.form} onSubmit={e => formSubmitHandler(e)}>
                            <h2 className={cs.wrapTitle}>
                                Личная информация
                            </h2>
                            <Input placeholder={'Фамилия студента'} required onChange={e => setForm({...form, surname: e})}/>
                            <Input placeholder={'Имя студента'} required onChange={e => setForm({...form, name: e})}/>
                            <Input placeholder={'Отчество студента'} required onChange={e => setForm({...form, patronymic: e})}/>
                            <Input type={"date"} placeholder={'Дата рождения студента'} required onChange={e => setForm({...form, date_of_b: e})}/>
                            <Input placeholder={'Паспорт студента'} mask={'0000 / 000000'} required onChange={e => setForm({...form, passport: e})}/>
                            <Input placeholder={'Телефон студента'} mask={'+7(000)000-00-00'} required onChange={e => setForm({...form, tel: e})}/>
                            <Select
                                options={separationData}
                                defaultValue={''}
                                defaultName={"Выберите отделение"}
                                onChange={e => setForm({...form, separation: e})}
                            />
                            <Select
                                options={specialityData}
                                defaultValue={''}
                                defaultName={"Выберите специальность"}
                                onChange={e => setForm({...form, speciality: e})}
                            />
                            <Input type={"date"} placeholder={'Дата поступления студента'} required onChange={e => setForm({...form, admission: e})}/>
                            <Input placeholder={'Группа студента'} required onChange={e => setForm({...form, s_group: e})}/>
                            <Button type={"submit"}>
                                Зарегистрировать студента
                            </Button>
                        </form>
                        <RoomList roomsData={roomsData} setRoomsData={setRoomsData} selectRoomHandler={selectRoomHandler} pickRoomId={form.roomNum}/>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default RegistrationPage;