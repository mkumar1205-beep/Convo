let io
let onlineUsers = {}

const initSocket = (server) => {
  const { Server } = require('socket.io')

  io = new Server(server, {
    cors: {
      origin: "*"
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userId) => {
      onlineUsers[userId] = socket.id
      console.log("Online users:", onlineUsers)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
}

module.exports = {
  initSocket,
  getIO: () => io,
  getOnlineUsers: () => onlineUsers
}