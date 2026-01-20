import React from 'react';

const ChatMssg = ({mObj, self}) => (
    <div className={`chat__mssg ${self}`}>
        <img src={mObj.photo} alt={mObj.name} className="chat__mssg-photo" />
        <div className="chat__mssg-block" style={{backgroundColor:mObj.color}}>
            <div className="chat__mssg-name">{mObj.name}</div>
            <div className="chat__mssg-text">{mObj.mssg}</div>
            <div className="chat__mssg-date">{mObj.date}</div>
        </div>
    </div>
);

export default ChatMssg;