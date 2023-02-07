import React from 'react'
import style from '../styles/chat.module.scss'
import socket from '../socket'



const Chat = ({users, messages, userName, roomId, addMessage}) => {

    const [messageValue, setMessageValue] = React.useState('')
    const messagesRef = React.useRef(null)
    
    const onSendMessage = () => {
        socket.emit('ROOM:NEW_MESSAGE', {
            userName,
            roomId,
            text: messageValue,
        })
        setMessageValue('')
        addMessage({userName, text : messageValue})
    }

    React.useEffect(() => {
        messagesRef.current.scrollTo(0, 9999)
    }, [messages])

    return (
        <div className={style.chat}>
            <div className={style.chat_users}>
                <h4>Комната:{roomId}</h4>
                <hr />
                <b>online({users.length}):</b> 
                <ul>
                    {users.map((name, index) => (
                        <li key={name + index}>{name}</li>
                    ))}
                </ul>
            </div>
            {/* messages */}
            <div className={style.chat_messages}>
                <div ref={messagesRef} className={style.messages}>
                    {/* message */}

                    {messages.map((message, i) => (
                        <div className={style.message} key={message.text + i} >
                            <p>{message.text}</p>
                            <div><span>{message.userName}</span></div>
                        </div>
                    ))}

                </div>
                <form action="#">
                    <textarea 
                        rows='3'
                        value={messageValue}
                        onChange={(e) => setMessageValue(e.target.value)}>    
                    </textarea>
                    <button onClick={onSendMessage }> 
                        send
                    </button>

                </form>
            </div>
        </div>
  )
}

export default Chat