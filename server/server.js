const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin : "*",
        methods : ["GET", "POST"]
    }
})
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({extended: true})) //для парсинга url

const rooms = new Map()

app.get('/rooms/:id', (req, res) => {
    const {id : roomId} = req.params
    const obj = rooms.has(roomId)
     ? {
        users : [...rooms.get(roomId).get('users').values()],
        messages : [...rooms.get(roomId).get('messages').values()]
       } 
    : {users: [], messages: []}
    res.json(obj)
})

app.post('/rooms', (req, res) => {
    const {roomId, userName} = req.body
    if(!rooms.has(roomId)){
        rooms.set(
            roomId,
            new Map([
                ['users', new Map()],
                ['messages', []],
            ])
        )
    }
    res.send()
})

io.on('connection', (socket) => {
    // JOIN
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id, userName)
        const users = [...rooms.get(roomId).get('users').values()]
        socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users)
    })
    // MESSAGE
    socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, text}) => {
        const obj = {
            userName,
            text
        }
        rooms.get(roomId).get('messages').push(obj)
        socket.to(roomId).emit('ROOM:NEW_MESSAGE', obj)
    })
    //DISCONNECT
    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if(value.get('users').delete(socket.id)){
                const users = [...value.get('users').values()]
                socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users)
            }
        })
    })
    console.log('user connected', socket.id)     
})

server.listen(PORT, (error) => {
    error ? console.log(error) : console.log("server started")
}) 
