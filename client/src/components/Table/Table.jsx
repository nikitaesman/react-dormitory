import React, {forwardRef, useEffect} from 'react';
import cs from './Table.module.css'
import TableHeader from "./TableHeader";
import Loader from "../UI/Loader/Loader";
import TableInput from "./TableInput";
import {useHttp} from "../../hooks/useHttp";
import {useDispatch, useSelector} from "react-redux";
import {addMessageHandler} from "../../store/messagesReducer";

const Table = forwardRef(({table, sortBy, loading}, ref) => {
    let rowNum = 0
    let cellNum = 0
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [request, requestLoading, requestError, requestClearError] = useHttp()

    useEffect(() => {
        dispatch(addMessageHandler(requestError))
        requestClearError()
    },[requestError])

    if (loading) {
        return (
            <Loader small={true}/>
        )
    }

    async function cellSave(rowId, cellTag, value) {
        let payload = {
            table: table.name,
            rowId,
            cellTag,
            value
        }

        const data = await request('/api/tables/changeCell', "POST", payload, {authorization: `Bearer ${user.token}`})

        if (data && data.type === "SUCCESSFUL") {
            dispatch(addMessageHandler(`Значение '${value}' успешно сохранено`))
        }
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

        return days+"."+months+"."+years+" "+hours+":"+minutes+""
    }

    return (
        <table ref={ref} border="1" style={{width: "100%"}} className={cs.Table}>
            <caption className={cs.caption}>
                {table.ruName}
            </caption>
            <thead>
                <tr className={cs.rowHeaders}>
                    {table.columns.map(column => {
                        rowNum++
                        return (
                            <TableHeader width={"initial"} sortBy={sortBy} key={'row#'+rowNum} name={column.name} value={column.value}/>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {table.table.map(row => {
                    rowNum++
                    let rowId = row.id
                    row = Object.entries(row)
                    return (
                        <tr key={rowNum}>
                            {row.map(cell => {
                                if (cell[0] === 'time') {
                                    let dateObj = new Date(cell[1])
                                    cell[1] = getMinimizedDate(dateObj)

                                }
                                cellNum++
                                return (
                                    <td key={cellNum} className={cs.cell}>
                                        <TableInput tableName={table.name} rowId={rowId} cellName={cell[0]} value={cell[1]} cellSave={cellSave}/>
                                    </td>
                                )
                            })}

                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
});

export default Table;