const path = require("path")
const http = require("http")
const express = require("express")
const socketio = require("socket.io")
const formatMessage = require("./utils/messages")
const { getUser, userJoin, userLeave, getRoomUsers } = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on("connection", socket => {
    socket.on("joinRoom", ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        
        socket.join(user.room)
        
        socket.emit("message", formatMessage("ChatCord", "Welcome to ChatCord"))
        
        socket.broadcast.to(user.room).emit("message", formatMessage("ChatCord", `${user.username} has joined to chat`))

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    
    socket.on("chatMsg", (msg) => {
        const user = getUser(socket.id)
        
        io.to(user.room).emit("message", formatMessage(user.username, msg))
    })
    
    socket.on("disconnect", () => {
        const user = getUser(socket.id)
        if(user) {
            userLeave(socket.id)
            io.to(user.room).emit("message", formatMessage(user.username, `${user.username} has left the chat`))

            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
    
})

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 8080

server.listen(PORT, () => console.log(`Started on port ${PORT}`))
