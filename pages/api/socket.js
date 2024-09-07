import { Server } from "socket.io";

const SocketHandler = (req, res) => {
    console.log("called api")
    if (res.socket.server.io) {
        console.log("socket already running")
    } else {
        const io = new Server(res.socket.server)
        res.socket.server.io = io
    
        io.on('connection', (socket) => {
            console.log("server is connected")

            socket.on('Peer-joined-room', (roomId, userId) => { //konse room me join hua hai ye room id se pata chalega aur konse user ne join kiya hai ye user id se pata chalega
                console.log("I am in the peer-joined-room socket.js backend")
                console.log(`a new user ${userId} joined room ${roomId}`)
                console.log(".................................................")
                socket.join(roomId) //connecting the peer user to the room
                socket.broadcast.to(roomId).emit('new-user-connected', userId) //sending the new user id to the other users in the room that a new user has joined
            })

            socket.on('user-toggle-audio', (userId, roomId) => {
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-toggle-audio', userId)
            })

            socket.on('user-toggle-video', (userId, roomId) => {
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-toggle-video', userId)
            })

            socket.on('user-leave', (userId, roomId) => {
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-leave', userId)
            })
        })
    }
    res.end();
}


export default SocketHandler;

