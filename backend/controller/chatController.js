const Message = require('../models/chat')
const User = require('../models/user')
const { io, onlineUsers } = require('../server')
const sendMessage = async (req, res) => {
  console.log("🔥 sendMessage called")
  try {
    const { receiverId, text } = req.body

    if (!receiverId || !text) {
      return res.status(400).json({
      success: false,
      message: 'Receiver and text are required'
     })
    }

    const receiver = await User.findById(receiverId)
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      })
    }
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text
    })

    const receiverSocketId = onlineUsers[receiverId]
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', message)
    }

    res.status(201).json({
      success: true,
      message
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getMessages = async (req, res) => {
  try {
    const myId = req.user._id
    const otherUserId = req.params.userId

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username')
    .populate('receiver', 'username')

    res.status(200).json({
      success: true,
      messages
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Message not found' })
    }

    // only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not allowed' })
    }

    await message.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Message deleted'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage
}