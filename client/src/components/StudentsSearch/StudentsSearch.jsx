import React, {useState,useEffect} from 'react';
import cs from './StudentsSearch.module.css'

import Input from "../UI/Input/Input";
import {useHttp} from "../../hooks/useHttp";
import {useSelector} from "react-redux";
import Loader from "../UI/Loader/Loader";

const StudentsSearch = ({setTakeUser}) => {
    const [request, loading, error, clearError] = useHttp()
    const user = useSelector(state => state.user)
    const [inputValue, setInputValue] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [foundUsers, setFoundUsers] = useState([])


    useEffect(() => {
        const timeOutId = setTimeout(searchHandler, 500);
        return () => clearTimeout(timeOutId);
    }, [inputValue]);

    async function searchHandler() {
        if (inputValue !== '') {
            if (inputValue !== searchQuery) {
                setSearchQuery(inputValue)
                try {
                    const queryArr = inputValue.split(' ')
                    const body = {
                        surname: queryArr[0] || '',
                        name: queryArr[1] || '',
                        patronymic: queryArr[2] || ''
                    }

                    const data = await request('/api/user/search', "GET", body, {authorization: `Bearer ${user.token}`})

                    if (data && data.type === "SUCCESSFUL") {
                        setFoundUsers(data.users)
                    }
                } catch (e) {

                }
            }
        } else {
            setFoundUsers([])
        }
    }

    function takeUser(e) {
        setInputValue('')
        setSearchQuery('')
        setFoundUsers([])
        setTakeUser(e)
    }

    function getMinimizedDate(longDate) {
        let days = longDate.getDate().toString()
        let months = (longDate.getMonth()+1).toString()
        let years = longDate.getFullYear().toString()
        let hours = longDate.getHours().toString()
        let minutes = longDate.getMinutes().toString()

        if (days.length < 2) {
            days = "0"+days
        }
        if (months.length < 2) {
            months = "0"+months
        }
        if (hours.length < 2) {
            hours = "0"+hours
        }
        if (minutes.length < 2) {
            minutes = "0"+minutes
        }

        return days+"."+months+"."+years
    }

    return (
        <div className={cs.search}>
            <Input onChange={e => setInputValue(e)} style={{width: "100%"}} placeholder={"Введите ФИО студента"}/>
            <div className={cs.results}>
                {loading ? <Loader small={true}/> :
                    foundUsers.map(foundUser =>
                        <div key={foundUser.id} className={cs.resultsItem} onClick={e => takeUser(foundUser)}>
                            <p>{foundUser.surname+' '+foundUser.name+' '+foundUser.patronymic+', '+foundUser.room+" комната, "+`${getMinimizedDate(new Date(foundUser.date_of_b))}`}</p>
                        </div>
                    )
                }

            </div>
        </div>
    );
};

export default StudentsSearch;