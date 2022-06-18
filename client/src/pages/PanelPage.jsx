import React, {useEffect, useRef, useState} from 'react';
import cs from '../styles/PanelPage.module.css'
import Select from "../components/UI/Select/Select";
import {useHttp} from "../hooks/useHttp";
import {useDispatch, useSelector} from "react-redux";
import Table from "../components/Table/Table";
import {addMessageHandler} from "../store/messagesReducer";
import TableSearch from "../components/Table/TableSearch";
import Button from "../components/UI/Button/Button";

const PanelPage = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const [request, loading, error] = useHttp()
    const [table, setTable] = useState({name: 'Название таблицы', ruName: '', table: {}, columns: [], isTable: false})
    const [tablesNames, setTablesNames] = useState([])
    const tableToPrint = useRef()

    const tablesAlphabet = {
        "students": "Студенты",
        "personal": "Персонал",
        "payments": "Оплата",
        "rooms": "Комнаты",
    }

    const namesAlphabet = {
        'id': "ID",
        'user_id': "ID студ.",
        'login': "Логин",
        'password': "Пароль",
        'surname': "Фамилия",
        'name': "Имя",
        'patronymic': "Отчество",
        'date_of_b': "Дата рождения",
        'passport': "Паспорт",
        'tel': "Телефон",
        'admission': "Дата поступления",
        'separation': "Отделение",
        'speciality': "Специальность",
        's_group': "Группа",
        'room': "Комната",
        'level': "Этаж",
        'price': "Тариф",
        'amount': "Сумма",
        'num': "Номер комнаты",
        'position': "Должность",
        'num_seats': "Всего мест",
        'seats_occupied': "Занятых мест",
        'time': "Время"
    }

    useEffect(() => {
        loadTablesNames()
    }, [])

    useEffect(() => {
        dispatch(addMessageHandler(error))
    }, [error])

    function tablesTranslate(val) {
        if (tablesAlphabet[val]) {
            return tablesAlphabet[val]
        }
        return val
    }

    function namesTranslate(val) {
        if (namesAlphabet[val]) {
            return namesAlphabet[val]
        }
        return val
    }

    async function loadTablesNames() {
        try {
            const data = await request('/api/tables/list', "GET", null, {authorization: `Bearer ${user.token}`})

            if (data.type === "SUCCESSFUL") {
                data.tablesNames.map(tableName => {
                    setTablesNames(prev => [...prev, {name: tablesTranslate(tableName), value: tableName}])
                })
            }
        } catch (e) {}
    }

    async function loadTableData(tableName, sort = 'id', searchTag = '', searchValue = '') {
        try {
            let dataBody = {
                tableName: tableName,
                sort: sort,
                searchTag,
                searchValue
            }

            const data = await request('/api/tables/table', "GET", dataBody, {authorization: `Bearer ${user.token}`})

            if (data && data.type === "SUCCESSFUL") {
                let columns = []
                let names = Object.entries(data.table[0])

                for (let i = 0; i < names.length; i++) {
                    columns.push({value: names[i][0], name: namesTranslate(names[i][0])})
                }

                setTable({name: data.tableName, ruName: tablesTranslate(data.tableName), table: data.table, columns, isTable: true})
            }

        } catch (e) {}
    }

    function sortBy(sort) {
        loadTableData(table.name, sort)
    }

    async function searchBy(searchTag, searchValue) {
        await loadTableData(table.name, 'id', searchTag, searchValue)
        dispatch(addMessageHandler('Поисковой запрос отправлен'))
    }

    function print() {
        if (!table.isTable) {
            return dispatch(addMessageHandler('Пожалуйста выберите таблицу'))
        }
        const myWindow = window.open(`${table.ruName}`, ``, "height=1080vh, width=1920vw");
        // стили таблицы
        myWindow.document.write(cs);
        myWindow.document.write(tableToPrint.current.outerHTML);
        myWindow.document.close(); // для IE >= 10
        myWindow.focus(); // для IE >= 10
        myWindow.print();
        myWindow.close();
        return true;
    }

    return (
        <section className={cs.Panel}>
            <div className="container">
                <div className={cs.content}>
                    <div className={cs.filters}>
                        <h2 className={cs.filtersTitle}>
                            Фильтры
                        </h2>
                        <div className={cs.filtersWrap}>
                            <div className={cs.selectTable}>
                                <label>
                                    Выберите таблицу
                                </label>
                                <Select
                                    options={tablesNames}
                                    defaultValue={''}
                                    defaultName={"Выбор таблицы"}
                                    onChange={e => loadTableData(e)}
                                />
                            </div>
                            <TableSearch table={table} searchBy={searchBy}/>
                            <div className={cs.printButtonBox}>
                                <Button onClick={print}>
                                    Печать
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={cs.tables}>
                        <h2 className={cs.filtersTitle}>
                            {tablesTranslate(table.name)}
                        </h2>
                        {table.isTable ?
                            <Table ref={tableToPrint} loading={loading} table={table} sortBy={sortBy}/>
                            :
                            <p className={cs.tablesNoTable}>Таблица не выбранна</p>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PanelPage;