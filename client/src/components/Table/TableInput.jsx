import React, {useEffect, useState} from 'react';
import cs from "./Table.module.css";

const TableInput = ({value, cellName, rowId, cellSave}) => {
    const [inputValue, setInputValue] = useState('')
    const [lastValue, setLastValue] = useState('')

    useEffect(() => {
        setInputValue(value)
        setLastValue(value)
    }, [])

    useEffect(() => {
        const timeOutId = setTimeout(cellChange, 500);
        return () => clearTimeout(timeOutId);
    }, [inputValue]);


    async function cellChange() {
        if (lastValue !== inputValue) {
            setLastValue(inputValue)
            cellSave(rowId,cellName,inputValue)
        }
    }


    return (
        <>
            <p className={cs.displayNone}>
                {inputValue}
            </p>
            <input
                style={{display: "none"}}
                disabled={cellName === 'id'|| cellName === 'login'|| cellName === 'password'}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className={inputValue !== lastValue ? cs.cellInput +" "+ cs.cellInputChanged : cs.cellInput}
            />
        </>
    );
};

export default TableInput;