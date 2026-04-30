const socket = io('http://localhost:5000')

socket.emit('join', userId)

socket.on('newMessage', (message) => {
  console.log('New message:', message)
})