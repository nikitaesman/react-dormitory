import React from 'react';
import cs from './Button2.module.css'

const Button2 = ({children, ...props}) => {
    return (
        <button className={cs.btn} {...props}>
            {children}
        </button>
    );
};

export default Button2;