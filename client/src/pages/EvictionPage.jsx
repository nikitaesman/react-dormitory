import React,{useState} from 'react';
import cs from "../styles/RelocationPage.module.css";
import StudentsSearch from "../components/StudentsSearch/StudentsSearch";
import Button from "../components/UI/Button/Button";
import {addMessageHandler} from "../store/messagesReducer";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../hooks/useHttp";
import Modal from "../components/Modal/Modal";

const EvictionPage = () => {
    const dispatch = useDispatch()
    const [request, loading, error, clearError] = useHttp()
    const user = useSelector(state => state.user)
    const [student, setStudent] = useState({})
    const [modalOpen, setModalOpen] = useState(false)

    function evictionRequestHandler() {
        try {
            if (Object.keys(student).length === 0) {
                throw new Error('Выберите студента из поиска')
            }
            if (parseInt(student.amount) < 0) {
                throw new Error('Нельзя удалить студента из базы пока у него имеется неоплаченный долг')
            }
            setModalOpen(true)
        } catch (e) {
            dispatch(addMessageHandler(e.message))
        }
    }

    async function evictionResponseHandler() {
        try {
            if (Object.keys(student).length === 0) {
                throw new Error('Выберите студента из поиска')
            }
            if (parseInt(student.amount) < 0) {
                throw new Error('Нельзя удалить студента из базы пока у него имеется неоплаченный долг')
            }

            let body = {
                studentId: student.id
            }

            const data = await request('/api/user/delete', "POST", body, {authorization: `Bearer ${user.token}`})

            if (data && data.type === "SUCCESSFUL") {
                setStudent({})
                setModalOpen(false)
                dispatch(addMessageHandler("Студент успешно выселен"))
            }
        } catch (e) {
            dispatch(addMessageHandler(e.message))
        }
    }

    return (
        <section className={cs.Relocation}>
            <div className={"container"}>
                <div className={cs.relocation}>
                    <StudentsSearch setTakeUser={setStudent}/>
                    {Object.keys(student).length !== 0 ?
                        <div style={{justifyContent: "center",marginTop: 50}} className={cs.relocationWrap}>
                            <Modal setModalOpen={setModalOpen} modalOpen={modalOpen}>
                                <div style={{display: "flex", flexDirection: "column", width: 500}}>
                                    <p>
                                        Вы уверенны что хотите выселить студента {student.surname+" "+student.name+" "+student.patronymic}
                                    </p>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <Button style={{width: "45%"}} onClick={evictionResponseHandler}>
                                            Да
                                        </Button>
                                        <Button style={{width: "45%"}} onClick={e => setModalOpen(false)}>
                                            Нет
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <div className={cs.profileContent}>
                                <div className={cs.profile}>
                                    <h2 className={cs.profileName}>
                                        {student.surname+" "+student.name+" "+student.patronymic}
                                    </h2>
                                    <div className={cs.profileWrap}>
                                        <div className={cs.profileColumn}>
                                            <p className={cs.profileText}>
                                                {student.amount} руб
                                            </p>
                                            <p className={cs.profileText}>
                                                {student.speciality}
                                            </p>
                                        </div>
                                        <div className={cs.profileColumn}>
                                            <p className={cs.profileText}>
                                                Комната {student.room}
                                            </p>
                                            <p className={cs.profileText}>
                                                Этаж {student.level}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={evictionRequestHandler}>
                                    Выселить студента
                                </Button>

                            </div>
                        </div>
                        : <div className={cs.pleaseSelect}>
                            Выберите пользователя
                        </div>
                    }
                </div>
            </div>
        </section>
    );
};

export default EvictionPage;