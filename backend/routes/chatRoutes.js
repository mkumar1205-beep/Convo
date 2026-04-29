const express = require('express')
const router = express.Router()

const protect = require('../middleware/protect')

const {
  sendMessage,
  getMessages,
  deleteMessage
} = require('../controller/chatController')

router.post('/', protect, sendMessage)
router.get('/:userId', protect, getMessages)
router.delete('/:id', protect, deleteMessage)

module.exports = router

console.log(sendMessage)