import React, {useEffect, useRef, useState} from 'react';
import cs from './Input.module.css'

const Input = ({placeholder, type = 'text', mask = '', onChange, ...props}) => {
    const inputEl = useRef()
    const [labelFocus, setLabelFocus] = useState(false)
    const [maskPattern, setMaskPattern] = useState('')
    const [maskValue, setMaskValue] = useState('')
    const [value, setValue] = useState('')

    String.prototype.replaceAt = function(index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }

    useEffect(() => {
        if (type === 'date' || mask !== '') {
            setLabelFocus(true)
        }
        if (mask !== '') {
            maskInit()
        }
    }, [])

    useEffect(() => {
        if (onChange !== undefined) {
            onChange(value)
        }
    }, [value])

    const specialSymbols = ["+","(",")","-","/"," ","_"]
    const reservedSymbols = {
        "0": ["1","2","3","4","5","6","7","8","9","0"],
        "*": ["a","b",]
    }

    function maskInit() {
        let newMaskValue = ''

        for (let i = 0; i<mask.length; i++) {
            if (specialSymbols.includes(mask[i])) {
                newMaskValue += mask[i]
            }else {
                if (reservedSymbols[mask[i]]) {
                    newMaskValue += '_'
                }else {
                    newMaskValue += mask[i]
                }
            }
        }
        setMaskPattern(prev => newMaskValue)
        setMaskValue(prev => newMaskValue)
    }


    function maskHandle(dop = '') {
        let newMaskValue = ''
        if (dop.length > mask.length) {
            dop = dop[dop.length - 1]

            for (let i = 0; i < mask.length; i++) {
                if (maskValue[i] !== '_') {
                    newMaskValue += maskPattern[i]
                } else {
                    newMaskValue = maskValue
                    if (reservedSymbols[mask[i]] !== undefined) {
                       if (reservedSymbols[mask[i]].includes(dop)) {
                           newMaskValue = newMaskValue.replaceAt(i,dop)
                           normalizeValue(newMaskValue)
                           return setMaskValue(newMaskValue)
                       }
                    }
                }
            }
        } else {
            for (let i = mask.length-1; i >= 0; i--) {
                if (specialSymbols.includes(maskValue[i]) === false && maskValue[i] !== "_" && (maskValue[i] !== mask[i] || maskValue[i] === "0")) {
                    newMaskValue = maskValue.replaceAt(i,"_")
                    normalizeValue(newMaskValue)
                    return setMaskValue(newMaskValue)
                }
            }
        }

    }

    function normalizeValue(newValue) {
        let normValue = ''
        for (let i = 0; i < newValue.length; i++) {
            if (specialSymbols.includes(newValue[i]) === false) {
                normValue += newValue[i]
            }
        }
        setValue(normValue)
    }

    function changeHandler(newValue) {
        if (mask !== '') {
            maskHandle(newValue)
        }else {
            setValue(newValue)
        }
    }

    function labelHandlerFocus() {
        setLabelFocus(true)
    }

    function labelHandlerUnFocus() {
        if (value === '' && type !== 'date' && mask === '') {
            setLabelFocus(false)
        }
    }

    return (
        <div className={cs.mainDiv}>
            <input
                ref={inputEl}
                minLength={mask !== '' ? mask.length : ""}
                value={mask !== '' ? maskValue : value}
                onFocus={labelHandlerFocus}
                onBlur={labelHandlerUnFocus}
                className={cs.input}
                type={type}
                onChange={e => changeHandler(e.target.value)}
                {...props}
            />
            <label className={labelFocus ? cs.label+' '+cs.label__focus : cs.label}>
                {placeholder}
            </label>
        </div>
    );
};

export default Input;