import React, {useEffect, useState} from 'react';
import cs from './Select.module.css'

const Select = ({options, defaultName, defaultValue, onChange, ...props}) => {
    const [boxFocus, setBoxFocus] = useState(false)
    const [selectedItem, setSelectedItem] = useState({name: defaultName, value: defaultValue})

    useEffect(() => {
        if (selectedItem.value !== defaultValue) {
            onChange(selectedItem.value)
        }
    },[selectedItem])

    return (
        <div
            className={boxFocus ? cs.selectBox + "  " + cs.selectBoxFocus : cs.selectBox }
            onClick={e => setBoxFocus(prev => !prev)}
        >
            <div className={cs.selectTriangle}/>

            <label className={cs.label}>
                {selectedItem.name}
            </label>
            <div
                className={boxFocus ? cs.selectList+' '+cs.selectListActive : cs.selectList}
            >
                <div className={cs.selectItem + ' ' + cs.selectItemDefault}
                    onClick={e => e.stopPropagation()}
                >
                    {defaultName}
                </div>
                {options.map(option =>
                    <div
                        className={cs.selectItem}
                        key={option.value}
                        onClick={e => setSelectedItem({name: option.name, value: option.value})}
                    >
                        {option.name}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Select;