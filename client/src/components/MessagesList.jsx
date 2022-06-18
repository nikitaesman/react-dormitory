import React from 'react';
import MessageBox from "./UI/MessageBox/MessageBox";

const MessagesList = ({mesArray}) => {
    return (
        <div className="MessageList">
            {mesArray.map((m)=>
                <MessageBox
                    key={m.id}
                    text={m.text}
                />
            )}
        </div>
    );
};

export default MessagesList;