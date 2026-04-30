const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')
require('dotenv').config()

const app = express()
app.use(cors({
  origin:["http://127.0.0.1:5500","http://localhost:5500"],
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/messages', require('./routes/chatRoutes'))

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

const onlineUsers = {}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userId) => {
      onlineUsers[userId] = socket.id
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err))

const PORT = 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = {io, onlineUsers}