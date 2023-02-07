import React from 'react'
import styles from '../styles/joinBlock.module.scss'
import socket from '../socket'
import axios from 'axios'

const JoinBlock = ({onLogin}) => {

   const [roomId, setRoomId] = React.useState('') 
   const [userName, setUserName] = React.useState('') 
   const [isLoading, SetIsLoading] = React.useState(false) 

   const onEnter = async() => {
    if(!roomId || !userName){ 
      return alert('Не верные данные')
    }
    const obj = {
      roomId, 
      userName,
    }
    SetIsLoading(true)
    await axios.post('/rooms', obj)
    onLogin(obj)
   }

  return (
    <div className={styles.form}>
        <input  type='text' placeholder='Room ID' 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value)}
        />
        <input  type='text' placeholder='user name' 
                value={userName} 
                onChange={(e) => setUserName(e .target.value)}
        />
        <button disabled={isLoading} onClick={onEnter}>
          {isLoading ? 'ВХОД...' : 'ВОЙТИ'}
        </button>
    </div>
  )
}

export default JoinBlock