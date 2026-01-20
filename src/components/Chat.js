import React from 'react';
import '../sass/chat.scss';
import ChatMssg from './ChatMssg';

class Chat extends React.Component {
    chRef = React.createRef();

    newChat = (event) => {
        event.preventDefault();
        this.props.addChat(this.chRef.current.value);
        this.chRef.current.value = '';
    }

    render() {
        const {chat, user, challengeName} = this.props;
        return (
            <div className="chat">
                <h2 className="chat__headline">{challengeName} Chat</h2>
                <div className="chat__window" id="chatWindow">
                    {chat &&
                        Object.keys(chat).map((key)=>{
                        let self = (user.info.uid === chat[key].uid)? 'self' : '';
                        return <ChatMssg key={key} mObj={chat[key]} self={self} />
                    })}
                </div>
                <form className="chat__form" onSubmit={this.newChat}>
                    <input type="text" className="chat__form-input" ref={this.chRef} placeholder="Got something to say?"/>
                    <button className="chat__form-submit" type="submit">
                        <span role="img" aria-label="up-arrow icon">🡅</span>
                    </button>
                </form>
            </div>
        );
    }
}

export default Chat;