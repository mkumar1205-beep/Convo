const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const http = require('http')
const { initSocket } = require('./socket')
const app = express()
const server = http.createServer(app)

initSocket(server)
require('dotenv').config()

app.use(cors({
  origin:["http://127.0.0.1:5500","http://localhost:5500"],
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/messages', require('./routes/chatRoutes'))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err))

const PORT = 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})