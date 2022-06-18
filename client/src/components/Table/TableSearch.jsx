import React,{useEffect, useState} from 'react';
import cs from "../../styles/PanelPage.module.css";
import Select from "../UI/Select/Select";

const TableSearch = ({table, searchBy}) => {
    const [searchTag, setSearchTag] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        const timeOutId = setTimeout(changeInputHandler, 500);
        return () => clearTimeout(timeOutId);
    }, [inputValue]);

    useEffect(() => {
        setSearchTag('')
        setSearchValue('')
        setInputValue('')
    },[table.name])

    function changeSelectHandler(e) {
        setSearchTag(e)
        setSearchValue('')
        setInputValue('')
    }

    function changeInputHandler() {
        if (searchValue !== inputValue && searchTag !== '') {
            setSearchValue(inputValue)
            searchBy(searchTag, inputValue)
        }
    }

    return (
        <div className={table.isTable ? cs.search : cs.search +" " +cs.searchNoVid}>
            <label className={cs.searchLabel}>
                Поиск по таблице
            </label>
            <Select
                options={table.columns}
                defaultValue={''}
                defaultName={"Выбор фильтра"}
                onChange={e => changeSelectHandler(e)}
            />
            <input className={cs.searchInput} value={inputValue} onChange={e => setInputValue(e.target.value)} type="text" placeholder="Введите текст для поиска"/>
        </div>
    );
};

export default TableSearch;