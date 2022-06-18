import React from 'react';
import cs from './MessageBox.module.css'

const MessageBox = ({text, ...props}) => {

    return (
        <div
            className={cs.MassageBox}
            {...props}
        >
            {text}
        </div>
    );
};

export default MessageBox;