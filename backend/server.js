const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err))

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/messages', require('./routes/chatRoutes'))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err))

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})