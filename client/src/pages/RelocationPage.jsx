import React, {useEffect, useState} from 'react';
import cs from '../styles/RelocationPage.module.css'
import StudentsSearch from "../components/StudentsSearch/StudentsSearch";
import RoomList from "../components/RoomList/RoomList";
import Button from "../components/UI/Button/Button";
import {useDispatch, useSelector} from "react-redux";
import {addMessageHandler} from "../store/messagesReducer";
import {useHttp} from "../hooks/useHttp";

const RelocationPage = () => {
    const dispatch = useDispatch()
    const [request, loading, error, clearError] = useHttp()
    const user = useSelector(state => state.user)
    const [student, setStudent] = useState({})
    const [roomsData, setRoomsData] = useState([])
    const [selectRoom, setSelectRoom] = useState(null)

    function selectRoomHandler(roomId) {
        setSelectRoom(roomId)
    }

    async function RelocationHandler() {
        try {
            if (Object.keys(student).length === 0) {
                throw new Error('Выберите студента из поиска')
            }
            if (selectRoom === null) {
                throw new Error('Выберите комнату из списка')
            }
            if (parseInt(student.room) === parseInt(selectRoom.num)) {
                throw new Error("Текущая комната не может быть выбранна")
            }

            const body = {
                studentId: student.id,
                roomId: selectRoom.id
            }
            const data = await request('/api/user/relocation', "POST", body, {authorization: `Bearer ${user.token}`})

            if (data && data.type === "SUCCESSFUL") {
                setStudent({})
                setSelectRoom(null)
                dispatch(addMessageHandler(data.message))
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
                        <div className={cs.relocationWrap}>
                            <div className={cs.profileContent}>
                                <div className={cs.profile}>
                                    <h2 className={cs.profileName}>
                                        {student.surname+" "+student.name+" "+student.patronymic}
                                    </h2>
                                    <div className={cs.profileWrap}>
                                        <div className={cs.profileColumn}>
                                            <p className={cs.profileText}>
                                                {student.date_of_b}
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
                                <Button onClick={RelocationHandler}>
                                    Пререселить студента
                                </Button>
                            </div>

                            <RoomList roomsData={roomsData} setRoomsData={setRoomsData} selectRoomHandler={selectRoomHandler} pickRoomId={selectRoom !== null ? selectRoom.num : ''}/>
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

export default RelocationPage;