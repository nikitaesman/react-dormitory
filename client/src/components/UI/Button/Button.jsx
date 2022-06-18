import React from 'react';
import cs from './Button.module.css'

const Button = ({children, ...props}) => {
    return (
        <button className={cs.btn} {...props}>
            {children}
        </button>
    );
};

export default Button;