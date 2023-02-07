import React from "react"
import JoinBlock from "./components/JoinBlock"
import Chat from "./components/Chat"
import reducer from './reducer'
import socket from './socket'
import axios from "axios"

const App = () => {

  const [state, dispatch] = React.useReducer(reducer, {
      joined: false,
      roomId: null,
      userName: null,
      users: [],
      messages: [],
  })

  const onLogin = async (obj) => {
    dispatch({
      type : 'JOINED',
      payload : obj,
    })

    socket.emit('ROOM:JOIN', obj)
    const {data} = await axios.get(`/rooms/${obj.roomId}`)
    setUsers(data.users)
    dispatch({
      type : 'SET_DATA',
      payload : data
    })
  }

  const setUsers = (users) => {
    dispatch({
      type : 'SET_USERS',
      payload : users,
    })
  }

  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    })
  } 

  React.useEffect(() => {
    console.log('faf');
    socket.on('ROOM:SET_USERS', setUsers)
    socket.on('ROOM:NEW_MESSAGE', addMessage)

  }, [])

  window.socket = socket
  return (
    <div className="wrapper">
        {!state.joined ? <JoinBlock onLogin={onLogin}/> : <Chat {...state} addMessage={addMessage}/>}
    </div>
  )
}

export default App
