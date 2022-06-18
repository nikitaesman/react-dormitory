import React,{useEffect} from 'react';
import cs from "../../styles/RegistrationPage.module.css";
import {useHttp} from "../../hooks/useHttp";
import {useSelector} from "react-redux";

const RoomList = ({roomsData, setRoomsData, selectRoomHandler, pickRoomId}) => {
    const user = useSelector(state => state.user)
    const [request, loading, error, clearError] = useHttp()

    useEffect(() => {
        updateRoomList()
    }, [])

    async function updateRoomList() {
        try {
            const data = await request('/api/rooms/available', "GET", null, {authorization: `Bearer ${user.token}`})

            if (data && data.type === "SUCCESSFUL") {
                let sortedRooms = data.rooms.sort((a, b) => a.floor > b.floor ? 1 : -1)
                let floors = []

                sortedRooms.map( room => {
                    if (floors[room.level-1] === undefined) {
                        floors[room.level-1] = []
                    }
                    floors[room.level-1].push(room)
                })

                setRoomsData(floors)
            }
        } catch (e) {

        }
    }
    return (
        <div className={cs.roomSelect}>
            <h2 className={cs.wrapTitle}>
                Выбор комнаты
            </h2>
            {roomsData.map((floor, index) =>
                <div key={index} className={cs.floorBox}>
                    <h3 className={cs.floorTitle}>
                        {index+1} этаж
                    </h3>
                    {floor.map(room =>
                        <div key={room.id} className={pickRoomId === room.num ? cs.room + ' ' + cs.roomActive : cs.room} onClick={e => selectRoomHandler(room)}>
                            <p className={cs.roomNumber}>
                                №{room.num}
                            </p>
                            <p className={cs.roomOcup}>
                                Занято
                            </p>
                            <p className={cs.roomPlaces}>
                                {room.seats_occupied} из {room.num_seats}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoomList;